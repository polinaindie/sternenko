// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist', 'storybook-static']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    globals: globals.browser,
  },
}, {
  // Vendored shadcn primitives: components export their cva variants and the
  // generated hooks use shadcn's own patterns. These are not edited by hand.
  files: ['src/components/**/*.tsx', 'src/hooks/**/*.ts'],
  rules: {
    'react-refresh/only-export-components': 'off',
    'react-hooks/set-state-in-effect': 'off',
  },
}, {
  // Storybook stories and config export non-component values by design.
  files: ['**/*.stories.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
  rules: {
    'react-refresh/only-export-components': 'off',
  },
}, ...storybook.configs["flat/recommended"]])
