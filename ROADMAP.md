# Rotapfel – Entwicklungsfahrplan / Roadmap

Baseline: Alpha 13.9.66. Planned versions are provisional; no new release is implied by this document.

## 13.9.67 – Foundation / Grundlagen
- [x] Initial source structure inventory.
- [x] Record architecture and roadmap.
- [ ] Map call sites and persisted card schemas before extraction.
- [ ] Add syntax/version checks and CI; establish geometry regression fixtures.
- [ ] Unify resource resolution and card configuration contracts.
- [ ] Make Equinox and Climate Cluster regular selectable external cards; keep existing presets as templates.
- [ ] Keep Rotapfel Simple ThermCard first-party.
- [ ] Verify old configurations remain readable; no automatic deletion.
- [ ] HA smoke test before release.

## 13.9.68 – Geometry / Positionierung
- [ ] Extract pure rectangle and collision functions.
- [ ] Central spacing policy, including 0 px; no mandatory grid.
- [ ] Shared intrinsic measurement and frame fitting; explicit fallback.
- [ ] Preserve manual sizes, locks, profile isolation and navigation policy.
- [ ] Verify preview/published layout parity and async resizing.

## 13.9.69 – Integration / Stabilisierung
- [ ] Original editor discovery, resource errors, YAML/JSON round-trip.
- [ ] Templates, direct tab cards, room cards and transfers.
- [ ] Desktop/mobile profiles and navigation.
- [ ] DE/EN UI and documentation.

## 13.9.70 – Regression / Gesamtabnahme
- [ ] Automated checks pass.
- [ ] HA native and external card matrix, including weather, calendar, Equinox, Climate Cluster and ThermCard.
- [ ] Publish permissions, save/reopen, reload and rollback checks.
- [ ] Document limitations and release notes DE/EN.

## Deferred until relevant layer is stable
Individual card sizing hacks, cosmetic editor fixes, marketplace matching refinements. Security and data integrity defects are never deferred.

## Acceptance principle
A card can be placed independently of its type, with explicit spacing down to zero where its outer geometry permits. Original card internals remain under card-author control. Existing dashboards are never silently deleted.
