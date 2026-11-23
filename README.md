# Rotapfel Homeassistant Dashboard Control Manager

A custom integration for Home Assistant to manage dashboards. **Alpha software — under development.**

## Version

- Integration domain: `rotapfel_dashboard_manager`
- Version in `manifest.json`: `0.2.0a13933`
- Source archive: Alpha 13.9.41

## Installation via HACS

1. Open HACS in Home Assistant.
2. Add `https://github.com/bax680/rotapfel-homeassistant-dashboard-manager` as a custom repository of type **Integration**.
3. Install the integration, restart Home Assistant, then open **Settings → Devices & services → Add integration**.
4. Search for **Rotapfel Dashboard Control Manager**.

The repository must include `custom_components/rotapfel_dashboard_manager/` with the integration files. The frontend JavaScript and logo assets belong in its `frontend/` subfolder.

**Note:** Installation and updates through the Home Assistant Marketplace have been successfully tested on the development system. This remains alpha software; back up Home Assistant before installation or updates.

## Manual installation

Copy `custom_components/rotapfel_dashboard_manager` into the Home Assistant `/config/custom_components/` directory, then restart Home Assistant.

## Repository layout

```text
custom_components/
└── rotapfel_dashboard_manager/
    ├── __init__.py
    ├── config_flow.py
    ├── const.py
    ├── manifest.json
    ├── brand/
    │   ├── icon.png
    │   └── logo.png
    └── frontend/
        ├── red-apple-logo.png
        ├── rotapfel-manager.js
        ├── rotapfel-canvas-card.js
        └── rotapfel-simple-thermcard.js
hacs.json
README.md
.gitignore
```

## Development status

The integration is currently an alpha release. Compatibility with existing dashboard/card configurations should be verified before production use.

## Bundled Rotapfel Simple ThermCard

The tested Rotapfel Simple ThermCard V1.0 is bundled at `frontend/rotapfel-simple-thermcard.js` and served from `/rotapfel_dashboard_manager/rotapfel-simple-thermcard.js`.

In Lovelace storage mode, the integration attempts to register this URL as a JavaScript module resource on setup. If automatic registration is unavailable (e.g. YAML resource mode), add this module URL manually under dashboard resources. The card type is `custom:rotapfel-simple-thermcard`.

The legacy DashHaus ORB card and its resource are not modified. Existing manual Rotapfel resource URLs are also not deleted or rewritten; avoid loading two copies of the same custom element at once. Equinox and Climate Cluster remain separate third-party dependencies.

**Status:** Marketplace installation and automatic resource registration have been tested on the development system. No tagged GitHub release has been published yet.

## License and upstream attribution

The bundled **Rotapfel Simple ThermCard** is a modified and renamed derivative of **DashHaus ORB** by **Krystian Czesak** (Copyright (c) 2026), distributed under the **MIT License**. The original MIT license text and copyright notice are retained in [LICENSE](LICENSE). Original project: https://github.com/krystosterone/dashhaus (https://krystosterone.github.io/dashhaus/orb/).

The bundled JavaScript also includes third-party notices (including React and ReactDOM); these notices must remain intact. Rotapfel modifications are not endorsed by or affiliated with the original DashHaus author. The LICENSE file preserves the upstream MIT terms; it does not independently establish authorship or license status of unrelated project components.

### Kartenbibliothek (Alpha 13.9.33)

Im Raumeditor können fertig konfigurierte Karten über **In Kartenbibliothek speichern** als wiederverwendbare Vorlage in Home Assistants persistentem Speicher abgelegt werden. Über **Aus Kartenbibliothek** mit einer Dropdownliste der gespeicherten Vorlagennamen lassen sie sich in anderen Räumen und Dashboards einfügen. Position, Geräteprofile, Gruppenbindung und Karten-ID werden nicht aus der Vorlage übernommen; die neue Karte erhält einen freien Platz. Maximal 100 Vorlagen.

### Alpha 13.9.33 – Kartenbibliothek V2, Platzierung, Schnelleinstellungen

Die gespeicherten Kartenvorlagen werden in einer durchsuchbaren grafischen Bibliothek mit Kartentyp und Entität angezeigt. Vorlagen lassen sich einfügen, umbenennen, bearbeiten oder nach Bestätigung löschen. Die gespeicherten Vorlagen bleiben im Home-Assistant-Store; bestehende Karten werden nicht rückwirkend geändert. Bei fehlendem freiem Platz versucht die automatische Platzierung vorsichtig, ausschließlich ungesperrte, ungruppierte Karten desselben Raums ohne separate Geräte-Layouts als Ganzes zu verschieben. Andernfalls bleibt die bisherige Kollisionswarnung. Für ausgewählte Mushroom- und Button-Cards bietet der Custom-Card-Editor zusätzlich Schnellfelder für Name, Icon und Farbe, ohne den YAML-Editor zu ersetzen.

### Alpha 13.9.34

Behebt den JavaScript-Syntaxfehler, der das Laden des Manager-Panels verhinderte.

### Alpha 13.9.35

Übernimmt Vorlagennamen beim Einfügen in die Kartenvorschau und platziert Duplikate ohne Überlagerung.

### Alpha 13.9.36

Längere Kartentitel lassen sich speichern. Meldungen zu ungültigen Kartendaten nennen Tab, Raum und Kartennummer.

### Alpha 13.9.37

Zeigt die Schnelleinstellungen für unterstützte Custom Cards auch bei Typen aus vorhandener YAML-Konfiguration und bei manueller Eingabe.

### Alpha 13.9.38

Einfügevorschau und Rückgängig für Bibliothekskarten und Duplikate. Die Schnelleinstellungen für Custom Cards bieten eine Icon-Auswahlliste.

### Alpha 13.9.39

Mehrere Kartenvorlagen mit gemeinsamer Vorschau einfügen und gemeinsam rückgängig machen.

### Alpha 13.9.40

Speichert Änderungen erst nach erfolgreicher Validierung, prüft die Kennung veröffentlichter Dashboards und bietet eine Zugriffsauswahl beim Veröffentlichen. Ältere Veröffentlichungen können im Manager entkoppelt werden.

### Alpha 13.9.41

Gliedert den Layoutmanager in Tab, Raum und Karten. Die Update-Info zeigt die installierte Rotapfel-Version und meldet verfügbare Updates aus einer zugeordneten Home-Assistant-Update-Entität.
