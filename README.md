# Rotapfel Homeassistant Dashboard Control Manager

A custom integration for Home Assistant to manage dashboards. **Alpha software — under development.**

## Version

- Integration domain: `rotapfel_dashboard_manager`
- Version in `manifest.json`: `0.2.0a137100`
- Source archive: Alpha 13.7.105

## Installation via HACS

1. Open HACS in Home Assistant.
2. Add `https://github.com/bax680/rotapfel-homeassistant-dashboard-manager` as a custom repository of type **Integration** (requires access to this private repository).
3. Install the integration, restart Home Assistant, then open **Settings → Devices & services → Add integration**.
4. Search for **Rotapfel Dashboard Control Manager**.

The repository must include `custom_components/rotapfel_dashboard_manager/` with the integration files. The frontend JavaScript and logo assets belong in its `frontend/` subfolder.

**Note:** HACS installation and Marketplace compatibility have not yet been tested. A private repository may require additional access setup. Back up Home Assistant before installation.

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
    └── frontend/
        ├── red-apple-logo.png
        ├── rotapfel-manager.js
        └── rotapfel-canvas-card.js
hacs.json
README.md
.gitignore
```

## Development status

The integration is currently an alpha release. Compatibility with existing dashboard/card configurations should be verified before production use.
