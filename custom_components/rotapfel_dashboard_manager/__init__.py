"""Rotapfel Dashboard Control Manager v0.2 alpha 13.9.41, isolated from existing dashboards."""
import asyncio
import copy
import json
import yaml
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from aiohttp import web
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.components import panel_custom
from homeassistant.helpers.storage import Store
from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION, PANEL_PATH

VERSION = "0.2.0a13941"

PROFILES = {"fire_hd", "smartphone", "tablet", "desktop"}

async def async_setup(hass, config):
    return True

async def async_setup_entry(hass, entry):
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    data = await store.async_load() or {"dashboards": []}
    lock = asyncio.Lock()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"store": store, "data": data, "lock": lock}
    hass.http.register_view(RotapfelView(hass, entry.entry_id))
    js_url = f"/{DOMAIN}/rotapfel-manager.js?v={VERSION}"
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            f"/{DOMAIN}/rotapfel-manager.js",
            str(Path(__file__).parent / "frontend" / "rotapfel-manager.js"),
            cache_headers=False,
        ),
        StaticPathConfig(
            f"/{DOMAIN}/rotapfel-canvas-card.js",
            str(Path(__file__).parent / "frontend" / "rotapfel-canvas-card.js"),
            cache_headers=False,
        ),
        *([StaticPathConfig(
            f"/{DOMAIN}/rotapfel-simple-thermcard.js",
            str(Path(__file__).parent / "frontend" / "rotapfel-simple-thermcard.js"),
            cache_headers=False,
        )] if (Path(__file__).parent / "frontend" / "rotapfel-simple-thermcard.js").is_file() else []),
        StaticPathConfig(
            f"/{DOMAIN}/red-apple-logo.png",
            str(Path(__file__).parent / "frontend" / "red-apple-logo.png"),
            cache_headers=False,
        ),
    ])
    # Register bundled ThermCard as a Lovelace resource in storage mode.
    # Existing resources and legacy ORB cards are left untouched.
    try:
        from homeassistant.components.lovelace import DOMAIN as LOVELACE_DOMAIN
        lovelace = hass.data.get(LOVELACE_DOMAIN)
        resources = getattr(lovelace, "resources", None)
        if resources is not None:
            await resources.async_load()
            thermcard_url = f"/{DOMAIN}/rotapfel-simple-thermcard.js"
            existing = resources.async_items()
            if not any(
                item.get("url", "").split("?")[0] == thermcard_url
                for item in existing
            ):
                await resources.async_create_item({
                    "url": thermcard_url,
                    "res_type": "module",
                })
    except Exception:
        import logging
        logging.getLogger(__name__).exception(
            "Could not register Rotapfel Simple ThermCard resource automatically"
        )
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="rotapfel-dashboard-manager",
        frontend_url_path=PANEL_PATH,
        module_url=js_url,
        sidebar_title="Rotapfel Control",
        sidebar_icon="mdi:food-apple",
        require_admin=True,
        config={},
    )
    return True

async def async_unload_entry(hass, entry):
    panel_custom.async_remove_panel(hass, PANEL_PATH)
    hass.data[DOMAIN].pop(entry.entry_id, None)
    return True

class RotapfelView(HomeAssistantView):
    url = f"/api/{DOMAIN}/{{action}}"
    name = f"api:{DOMAIN}"
    requires_auth = True

    def __init__(self, hass, entry_id):
        self.hass = hass
        self.entry_id = entry_id

    def _state(self):
        return self.hass.data[DOMAIN][self.entry_id]

    @staticmethod
    def _check_admin(request):
        if not request["hass_user"].is_admin:
            raise web.HTTPForbidden()

    @staticmethod
    def _snapshot(target, reason):
        # Keep at most 15 independent, server-side snapshots per dashboard.
        keys = ("name", "profile", "theme", "canvas", "deviceProfiles", "tabs", "cards")
        snapshot = {k: copy.deepcopy(target[k]) for k in keys if k in target}
        history = target.setdefault("history", [])
        if history and history[-1].get("snapshot") == snapshot:
            return
        history.append({"id": str(uuid.uuid4()), "timestamp": datetime.now(timezone.utc).isoformat(),
                        "reason": reason, "snapshot": snapshot})
        del history[:-15]

    async def get(self, request, action):
        self._check_admin(request)
        if action == "dashboard_history":
            target = next((d for d in self._state()["data"]["dashboards"] if d["id"] == request.query.get("id")), None)
            if target is None:
                raise web.HTTPNotFound(text="Dashboard not found")
            return self.json({"history": [{"id": v["id"], "timestamp": v["timestamp"], "reason": v["reason"], "manual": bool(v.get("manual", False))} for v in target.get("history", []) + target.get("manual_history", [])]})
        if action == "dashboard_version_snapshot":
            target = next((d for d in self._state()["data"]["dashboards"] if d["id"] == request.query.get("id")), None)
            if target is None:
                raise web.HTTPNotFound(text="Dashboard not found")
            version_id = request.query.get("version_id")
            if version_id == "current":
                keys = ("name", "profile", "theme", "canvas", "deviceProfiles", "tabs", "cards")
                snapshot = {k: copy.deepcopy(target[k]) for k in keys if k in target}
                return self.json({"snapshot": snapshot})
            version = next((v for v in target.get("history", []) + target.get("manual_history", []) if v.get("id") == version_id), None)
            if version is None:
                raise web.HTTPNotFound(text="Version not found")
            return self.json({"snapshot": copy.deepcopy(version["snapshot"])})
        if action == "card_library":
            return self.json({"cards": self._state()["data"].get("card_library", [])})
        if action == "layout_templates":
            return self.json({"templates": self._state()["data"].get("layout_templates", [])})
        if action == "design_templates":
            return self.json({"templates": self._state()["data"].get("design_templates", [])})
        if action != "dashboards":
            raise web.HTTPNotFound()
        return self.json({"dashboards": self._state()["data"]["dashboards"], "version": VERSION})

    @staticmethod
    def _valid_canvas(value):
        return (isinstance(value, dict)
                and value.get("mode") in {"responsive", "fixed"}
                and all(type(value.get(key)) is int and lo <= value[key] <= hi
                        for key, lo, hi in (("width", 320, 7680), ("height", 240, 4320),
                                            ("columns", 1, 24), ("gap", 0, 64))))

    async def post(self, request, action):
        self._check_admin(request)
        if action not in {"create", "update", "duplicate", "delete", "save_layout", "save_design_templates", "save_layout_templates", "publication", "restore_version", "create_manual_version", "delete_manual_version", "parse_card_yaml", "save_card_library"}:
            raise web.HTTPNotFound()
        try:
            body = await request.json()
        except (ValueError, web.HTTPBadRequest):
            raise web.HTTPBadRequest(text="Invalid JSON")
        if not isinstance(body, dict):
            raise web.HTTPBadRequest(text="Expected a JSON object")
        if action == "parse_card_yaml":
            source = body.get("yaml")
            if not isinstance(source, str) or len(source) > 100_000:
                raise web.HTTPBadRequest(text="YAML-Konfiguration fehlt oder ist zu lang")
            try:
                parsed = yaml.safe_load(source)
                if not isinstance(parsed, dict):
                    raise ValueError("Die Konfiguration muss ein YAML-Objekt sein")
                # Reject YAML-specific scalar values that cannot round-trip to JSON.
                json.dumps(parsed, allow_nan=False)
                if not all(isinstance(key, str) for key in parsed):
                    raise ValueError("Alle YAML-Schlüssel müssen Text sein")
            except (yaml.YAMLError, ValueError, TypeError, OverflowError) as exc:
                raise web.HTTPBadRequest(text=f"Ungültige YAML-Konfiguration: {exc}") from exc
            return self.json({"config": parsed})
        state = self._state()
        async with state["lock"]:
            data = copy.deepcopy(state["data"])

            async def save():
                await state["store"].async_save(data)
                state["data"] = data

            if action == "save_card_library":
                cards = body.get("cards")
                if not isinstance(cards, list) or len(cards) > 100:
                    raise web.HTTPBadRequest(text="Ungültige Kartenbibliothek (maximal 100 Vorlagen)")
                seen = set()
                for item in cards:
                    if not isinstance(item, dict) or set(item) != {"id", "name", "card"}:
                        raise web.HTTPBadRequest(text="Ungültiger Bibliothekseintrag")
                    ident, name, card = item["id"], item["name"], item["card"]
                    if not isinstance(ident, str) or not 1 <= len(ident) <= 100 or ident in seen:
                        raise web.HTTPBadRequest(text="Ungültige oder doppelte Vorlagen-ID")
                    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 100:
                        raise web.HTTPBadRequest(text="Ungültiger Vorlagenname")
                    if not isinstance(card, dict) or len(json.dumps(card, allow_nan=False)) > 100_000:
                        raise web.HTTPBadRequest(text="Ungültige Kartenvorlage")
                    seen.add(ident)
                data["card_library"] = copy.deepcopy(cards)
                await save()
                return self.json({"cards": cards})
            if action == "save_layout_templates":
                templates = body.get("templates")
                if not isinstance(templates, list) or len(templates) > 100:
                    raise web.HTTPBadRequest(text="Invalid layout templates")
                names = set()
                for template in templates:
                    if not isinstance(template, dict):
                        raise web.HTTPBadRequest(text="Invalid template")
                    name = template.get("name")
                    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 80 or name.casefold() in names:
                        raise web.HTTPBadRequest(text="Invalid or duplicate template name")
                    names.add(name.casefold())
                    if not isinstance(template.get("id"), str) or not 1 <= len(template["id"]) <= 100:
                        raise web.HTTPBadRequest(text="Invalid template id")
                    tabs = template.get("tabs")
                    if not isinstance(tabs, list) or len(tabs) > 30:
                        raise web.HTTPBadRequest(text="Invalid template tabs")
                    if not isinstance(template.get("deviceProfiles", {}), dict):
                        raise web.HTTPBadRequest(text="Invalid device profiles")
                    if not isinstance(template.get("canvas"), dict):
                        raise web.HTTPBadRequest(text="Invalid canvas")
                data["layout_templates"] = templates
                await save()
                return self.json({"templates": templates})
            if action == "save_design_templates":
                templates = body.get("templates")
                if not isinstance(templates, list) or len(templates) > 60:
                    raise web.HTTPBadRequest(text="Invalid design templates")
                seen_names = set()
                for template in templates:
                    if not isinstance(template, dict) or set(template) != {"name", "design", "display"}:
                        raise web.HTTPBadRequest(text="Invalid design template")
                    name = template["name"]
                    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 60 or name.casefold() in seen_names:
                        raise web.HTTPBadRequest(text="Invalid or duplicate template name")
                    seen_names.add(name.casefold())
                    design, display = template["design"], template["display"]
                    if not isinstance(design, dict) or not isinstance(display, dict) or len(str(template)) > 12000:
                        raise web.HTTPBadRequest(text="Invalid template values")
                    if not all(isinstance(design.get(k), str) and re.fullmatch(r"#[0-9a-fA-F]{6}", design[k]) for k in ("bg", "fg", "accent")):
                        raise web.HTTPBadRequest(text="Invalid template colors")
                    if any(not isinstance(display.get(k, True), bool) for k in ("show_name", "show_entity_id")):
                        raise web.HTTPBadRequest(text="Invalid display flags")
                data["design_templates"] = templates
                await save()
                return self.json({"templates": templates})
            dashboards = data["dashboards"]
            if action == "publication":
                target = next((d for d in dashboards if d["id"] == body.get("id")), None)
                if target is None:
                    raise web.HTTPNotFound(text="Dashboard not found")
                publication = body.get("publication")
                if publication is not None:
                    if (
                        not isinstance(publication, dict)
                        or set(publication) != {"url_path", "dashboard_id", "owner_key"}
                        or not isinstance(publication["dashboard_id"], str)
                        or not 1 <= len(publication["dashboard_id"]) <= 255
                        or not isinstance(publication["owner_key"], str)
                        or not re.fullmatch(r"[0-9a-f]{32}", publication["owner_key"])
                    ):
                        raise web.HTTPBadRequest(text="Invalid publication")
                    path = publication["url_path"]
                    expected = "rotapfel-" + re.sub(r"[^a-z0-9]", "", target["id"].lower())[:20]
                    if path != expected:
                        raise web.HTTPBadRequest(text="Invalid publication path")
                    for other in dashboards:
                        if other is not target and other.get("publication", {}).get("url_path") == path:
                            raise web.HTTPConflict(text="Publication path already owned")
                    target["publication"] = publication
                else:
                    target.pop("publication", None)
                await save()
                return self.json({"dashboards": dashboards})

            target = next((d for d in dashboards if d["id"] == body.get("id")), None)
            if action == "create_manual_version":
                if target is None:
                    raise web.HTTPNotFound(text="Dashboard not found")
                label = body.get("label")
                if not isinstance(label, str) or not 1 <= len(label.strip()) <= 80:
                    raise web.HTTPBadRequest(text="Sicherungspunkt-Name muss 1 bis 80 Zeichen enthalten")
                keys = ("name", "profile", "theme", "canvas", "deviceProfiles", "tabs", "cards")
                snapshot = {k: copy.deepcopy(target[k]) for k in keys if k in target}
                target.setdefault("manual_history", []).append({
                    "id": str(uuid.uuid4()), "timestamp": datetime.now(timezone.utc).isoformat(),
                    "reason": label.strip(), "manual": True, "snapshot": snapshot})
                await save()
                return self.json({"ok": True})
            if action == "delete_manual_version":
                if target is None:
                    raise web.HTTPNotFound(text="Dashboard not found")
                manual = target.get("manual_history", [])
                match = next((v for v in manual if v.get("id") == body.get("version_id")), None)
                if match is None:
                    raise web.HTTPNotFound(text="Manueller Sicherungspunkt nicht gefunden")
                manual.remove(match)
                await save()
                return self.json({"ok": True})
            if action == "restore_version":
                if target is None:
                    raise web.HTTPNotFound(text="Dashboard not found")
                version = next((v for v in (target.get("history", []) + target.get("manual_history", [])) if v["id"] == body.get("version_id")), None)
                if version is None:
                    raise web.HTTPNotFound(text="Version not found")
                self._snapshot(target, "Vor Wiederherstellung")
                restored = copy.deepcopy(version["snapshot"])
                # Keep dashboard identity and publication ownership unchanged.
                for key in ("name", "profile", "theme", "canvas", "deviceProfiles", "tabs", "cards"):
                    if key in restored:
                        target[key] = restored[key]
                    else:
                        target.pop(key, None)
                target["updated_at"] = datetime.now(timezone.utc).isoformat()
                await save()
                return self.json({"dashboards": dashboards})
            if action != "create" and target is None:
                raise web.HTTPNotFound(text="Dashboard not found")
            if action in {"create", "update"}:
                name = body.get("name")
                profile = body.get("profile")
                if not isinstance(name, str) or not 1 <= len(name.strip()) <= 80 or profile not in PROFILES:
                    raise web.HTTPBadRequest(text="Name (1-80 characters) and valid profile required")
                now = datetime.now(timezone.utc).isoformat()
                if action == "create":
                    target = {"id": str(uuid.uuid4()), "name": name.strip(), "profile": profile,
                              "created_at": now, "updated_at": now, "cards": [], "tabs": []}
                    dashboards.append(target)
                else:
                    if target.get("name") != name.strip() or target.get("profile") != profile:
                        self._snapshot(target, "Vor Umbenennen/Bearbeiten")
                    target.update(name=name.strip(), profile=profile, updated_at=now)
            elif action == "save_layout":
                tabs = body.get("tabs")
                if not isinstance(tabs, list) or len(tabs) > 30:
                    raise web.HTTPBadRequest(text="Invalid tabs")
                seen = set()
                for tab in tabs:
                    if not isinstance(tab, dict) or not isinstance(tab.get("id"), str) or tab["id"] in seen or not isinstance(tab.get("name"), str) or not 1 <= len(tab["name"].strip()) <= 80:
                        raise web.HTTPBadRequest(text="Invalid tab")
                    if "canvas" in tab and not self._valid_canvas(tab["canvas"]):
                        raise web.HTTPBadRequest(text="Invalid tab canvas")
                    seen.add(tab["id"])
                    rooms = tab.get("rooms")
                    if not isinstance(rooms, list) or len(rooms) > 50:
                        raise web.HTTPBadRequest(text="Invalid rooms")
                    for room in rooms:
                        if not isinstance(room, dict) or not isinstance(room.get("id"), str) or not isinstance(room.get("name"), str) or not 1 <= len(room["name"].strip()) <= 80:
                            raise web.HTTPBadRequest(text="Invalid room")
                        cards = room.get("cards")
                        if not isinstance(cards, list) or len(cards) > 100:
                            raise web.HTTPBadRequest(text="Invalid cards")
                        for index, card in enumerate(cards, start=1):
                            location = f"{tab['name']} / {room['name']} / Karte {index}"
                            if not isinstance(card, dict):
                                raise web.HTTPBadRequest(text=f"{location}: Ungültiges Kartenformat")
                            if card.get("type") not in ("placeholder", "entity", "custom"):
                                raise web.HTTPBadRequest(text=f"{location}: Ungültiger Kartentyp")
                            if not isinstance(card.get("id"), str):
                                raise web.HTTPBadRequest(text=f"{location}: Ungültige Karten-ID")
                            if not isinstance(card.get("title"), str):
                                raise web.HTTPBadRequest(text=f"{location}: Kartentitel muss Text sein")
                            design = card.get("design")
                            if design is not None:
                                if not isinstance(design, dict) or not isinstance(design.get("width"), int) or not 1 <= design["width"] <= 4 or not isinstance(design.get("height"), int) or not 76 <= design["height"] <= 320 or any(not isinstance(design.get(k), str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", design[k]) for k in ("bg", "fg", "accent")):
                                    raise web.HTTPBadRequest(text="Invalid card design")
                            if card["type"] == "custom":
                                config = card.get("custom_config")
                                legacy = card.get("custom")
                                if config is not None:
                                    if not isinstance(config, dict) or not isinstance(config.get("type"), str) or not re.fullmatch(r"custom:[a-z0-9_-]+", config["type"], re.IGNORECASE):
                                        raise web.HTTPBadRequest(text="Invalid custom card configuration")
                                elif not isinstance(legacy, dict):
                                    raise web.HTTPBadRequest(text="Missing custom card configuration")
                            if card["type"] == "entity":
                                eid = card.get("entity_id")
                                if not isinstance(eid, str) or len(eid) > 255 or not re.fullmatch(r"(?:light|switch|sensor|binary_sensor|climate|cover|input_boolean)\.[a-z0-9_]+", eid):
                                    raise web.HTTPBadRequest(text="Invalid entity ID")
                theme = body.get("theme", "light")
                if theme not in {"light", "dark"}:
                    raise web.HTTPBadRequest(text="Invalid theme")
                canvas = body.get("canvas", {"mode": "responsive", "width": 1920, "height": 1080, "columns": 12, "gap": 8})
                if not self._valid_canvas(canvas):
                    raise web.HTTPBadRequest(text="Invalid dashboard canvas")
                self._snapshot(target, "Vor Layout speichern")
                target["canvas"] = canvas
                target["theme"] = theme
                profiles = body.get("deviceProfiles", {})
                if not isinstance(profiles, dict) or len(profiles) > 30:
                    raise web.HTTPBadRequest(text="Invalid device profiles")
                for key, p in profiles.items():
                    if not isinstance(key, str) or not key.startswith("custom_") or not isinstance(p, dict):
                        raise web.HTTPBadRequest(text="Invalid device profile")
                    if not isinstance(p.get("name"), str) or not 1 <= len(p["name"]) <= 60:
                        raise web.HTTPBadRequest(text="Invalid device profile name")
                    if type(p.get("width")) is not int or not 320 <= p["width"] <= 10000 or type(p.get("height")) is not int or not 240 <= p["height"] <= 10000:
                        raise web.HTTPBadRequest(text="Invalid device profile dimensions")
                    if type(p.get("fixed")) is not bool:
                        raise web.HTTPBadRequest(text="Invalid device profile height mode")
                target["deviceProfiles"] = profiles
                target["tabs"] = tabs
                target["updated_at"] = datetime.now(timezone.utc).isoformat()
            elif action == "duplicate":
                target = copy.deepcopy(target)
                target.pop("publication", None)  # Copies must never inherit the source publication.
                target.pop("history", None)  # A duplicate starts with its own history.
                target["id"] = str(uuid.uuid4())
                target["name"] = (target["name"] + " (Kopie)")[:80]
                target["created_at"] = target["updated_at"] = datetime.now(timezone.utc).isoformat()
                dashboards.append(target)
            else:
                dashboards.remove(target)
            await save()
            return self.json({"dashboards": dashboards})
