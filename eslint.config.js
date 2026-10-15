// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Vendored reacticx registry components: copied source that follows the
    // registry's own Reanimated patterns. The React Compiler lint rules
    // false-positive on legitimate SharedValue mutation (`.value = ...`).
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/globals": "off",
    },
  },
]);
