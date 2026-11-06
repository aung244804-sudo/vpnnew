## 2026-11-03 - Search Clear Pattern in Steampunk Design System
**Learning:** Filter and search inputs rendered within modal overlays (like PublicDirectory in ServerManager) need explicit trailing padding (e.g. `padding-right: 36px`) and an absolute positioned clear button with proper `aria-label` translation to prevent input text collision and maintain accessibility.
**Action:** When adding text clear buttons to inputs, wrap the input in a relative container, add trailing padding to the input class, and provide localized `aria-label`s for all supported locales.

## 2026-11-04 - Dual-Action Password/Key Input Controls
**Learning:** In flex input bars containing an inline visibility toggle (such as `.api-field`), adding an inline clear button requires explicit sizing (`width: 28px; height: 28px; flex-shrink: 0`) and keyboard focus styling so the clear and toggle controls coexist neatly without shifting layout or hiding long masked strings.
**Action:** In compound input groups with multiple icon buttons, set flex-shrink to 0 on auxiliary action buttons, provide dedicated `aria-label`s with full Myanmar localization, and verify screen reader accessibility across both masked (`password`) and plaintext (`text`) states.
