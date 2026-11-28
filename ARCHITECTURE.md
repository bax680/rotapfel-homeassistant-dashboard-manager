# Rotapfel – Zielarchitektur / Target architecture

Baseline: Alpha 13.9.66 (0.2.0a13966), commit 6dd9c07.
Status: design proposal approved in principle; implementation pending.

## Mission / Leitbild
Maximale Gestaltungsfreiheit. Minimale Kartenabstände. Keine starren Raster.
Maximum layout freedom. Minimal card spacing. No rigid grids.

Rotapfel owns placement, sizing, spacing, device layouts, navigation and publication. Home Assistant and card authors own card rendering and configuration. Do not reproduce third-party editors.

## Current code inventory
- frontend/rotapfel-manager.js: 4,828 lines; manager UI, card configuration, resource discovery, placement, preview and publication.
- frontend/rotapfel-canvas-card.js: 545 lines; published canvas and navigation rendering.
- __init__.py: 641 lines; integration lifecycle, HTTP API, persistence and shared publication.
- Existing resource paths: discoverResources/readResources/ensureExternalResource versus discoverCustomCardTypes/ensureGenericCustomResource.
- Existing configuration paths: externalConfig, configureNativeCard, configureCustomCard, customDesignProfile.
- Existing geometry paths: cardPositions, planCardPlacement, planBatchInsertion, idealCardDimensions, idealCustomCardWidth, nativeFrameHeight, fittedFrameHeight, autoFitExternalFrames.
- This is a structural inventory, not an exhaustive call graph or verified runtime audit.

## Target boundaries
1. Card registry: canonical type, installed/loaded/allowed/editor availability as separate states. One resource resolver with validated local URLs, shared loading promises and retryable failures.
2. Card configuration: canonical Lovelace config; native or original custom editor where supported; YAML/JSON fallback; preserve unknown properties. Do not infer unsupported card options. Equinox and Climate Cluster become regular external cards. Preserve current presets as templates. Rotapfel Simple ThermCard remains first-party.
3. Geometry engine: pure functions for rectangle placement, collision, spacing, snapping and bounds. No card-type dependency. Explicit spacing in CSS pixels including zero; optional snap, no mandatory grid. Preserve locked cards and device-specific coordinates.
4. Measurement adapter: measure rendered intrinsic content at selected width; distinguish wrapper from actual card surface; handle async content, hidden elements, resize loops and user edits. Explicit fallback for cards with no measurable intrinsic size. Do not promise removal of internal padding controlled by third-party cards.
5. Preview and publication: share geometry semantics and configuration; published layout must match editor for same profile and viewport. Navigation reserves space only according to explicit layout policy.
6. Persistence: retain dashboard IDs, permissions, profile layouts, templates and original config. No automatic deletion. Legacy variants remain readable until conversion is verified. No broad migration required for new dashboards; existing data must not silently disappear.
7. UI: manager orchestrates modules; DE/EN strings; preserve mobile and desktop behavior.

## Quality gates
Syntax checks for JS and Python; version consistency; geometry unit tests for zero spacing, bounds, locked rectangles, collision, resizing and profile isolation; resource/editor error handling; manual HA smoke tests including publication and reload. CI success is not a substitute for browser testing. No release claims before actual results.

## Change policy
Extract incrementally, test behavior before deleting legacy paths, keep baseline recoverable. Security/data-loss fixes take precedence. Defer cosmetic or card-specific workarounds until relevant shared layer is stable.
