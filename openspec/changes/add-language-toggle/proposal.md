## Why

The site currently renders only English copy and lacks a way for Portuguese-speaking visitors to read the content without using external tools. A native language selector aligns with Apple HIG expectations for segmented controls and supports Tulio's Brazilian audience.

## What Changes

- Add an Apple HIG–compliant segmented toggle that defaults to English and lets users switch to Portuguese (Brazil).
- Introduce an internal i18n layer with locale bundles so core UI strings update instantly when the toggle changes.
- Persist the user's language preference client-side and ensure the selection remains across sessions.

## Impact

- Affected specs: site-language
- Affected code: layout header/topbar, new i18n utilities, shared copy consumers (e.g., hero, navigation, cards)
