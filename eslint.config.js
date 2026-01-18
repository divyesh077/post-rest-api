import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],

    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.git/**',
      'logs/**',
      'tmp/**',
      '*.min.js',
    ],

    plugins: {
      js,
    },

    extends: ['js/recommended'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },

    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  // ✅ This disables ESLint formatting rules that conflict with Prettier
  prettier,
]);
