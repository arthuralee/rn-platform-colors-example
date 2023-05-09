# rn-platform-colors-example

An example expo app with dark mode support using PlatformColors

## Setup steps
1. `npx expo prebuild`
2. `npx run:ios` or `npx run:android`

## How to
To change the available colors, edit the `platformColors` entry in `app.json`. Each entry must have a `light` and `dark` property and must be a properly formatted hex color string (alpha is not supported by the plugin yet). To use the colors, import `colors` from `colors.js` and refer to colors by token name, e.g. `colors.background`.
