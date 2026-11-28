# Rotapfel – Entwicklungsfahrplan / Roadmap

Baseline: Alpha 13.9.66. Planned versions are provisional; no new release is implied by this document.

## 13.9.67 – Foundation / Grundlagen
- [x] Initial source structure inventory.
- [x] Record architecture and roadmap.
- [ ] Map call sites and persisted card schemas before extraction.
- [x] Add syntax/version checks and CI; establish geometry regression fixtures.
- [ ] Unify resource resolution and card configuration contracts.
- [ ] Make Equinox and Climate Cluster regular selectable external cards; keep existing presets as templates.
- [ ] Keep Rotapfel Simple ThermCard first-party.
- [ ] Verify old configurations remain readable; no automatic deletion.
- [ ] HA smoke test before release.

## 13.9.68 – Geometry / Positionierung
- [ ] Extract pure rectangle and collision functions.
- [x] Central spacing policy, including 0 px; no mandatory grid.
- [ ] Shared intrinsic measurement and frame fitting; explicit fallback.
- [ ] Preserve manual sizes, locks, profile isolation and navigation policy.
- [ ] Verify preview/published layout parity and async resizing.

## 13.9.69 – Integration / Stabilisierung
- [ ] Restore interactive collision pushing (fix committed; CI and HA retest pending).
- [ ] Confirm 13.9.68 practical acceptance after collision fix.
- [ ] Verify external card resource loading failure and retry behavior.
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

## Alpha 13.9.68 validation
21 regression tests passed before release. User completed eight HA test tasks; screenshots show broadly matching relative geometry, but interactive collision pushing failed. Fix is included in the next development cycle. Browser-level async resizing and full navigation/profile coverage remain open.

## Alpha 13.9.69 validation (2026-11-28)
- Automated quality gate: 32/32 tests passed, run 46126603201, version 0.2.0a13969.
- Practical HA acceptance: 10/12 checks passed (Marketplace update, locked cards, original editors, templates, transfers, device profiles, navigation, DE/EN UI, save/publish, preview parity).
- Open, not reported as failed: interactive collision pushing and YAML/JSON save/reopen.
- Full acceptance pending these two checks; full translation and lossless external editor round-trip are not established by this checklist alone.

### Alpha 13.9.70 – user-approved positioning policy
- Interactive collision displacement must allow even fully locked cards to move repeatedly, preserving dimensions and all lock flags.
- Automatic insertion respects position locks.
- Automatic arrangement and horizontal/vertical distribution respect locks by default; add a default-off checkbox to temporarily ignore position locks without clearing stored flags.
- Regression coverage must exercise repeated collision displacement, lock preservation and both checkbox states.
- Fix transfers into tabs without rooms using a direct-tab destination; preserve card geometry and profile data.
- Investigate compact navigation footprint and dynamic translation of system-generated room labels and canvas metadata.
