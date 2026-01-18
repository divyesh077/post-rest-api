import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

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
      import: importPlugin
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

      // import order
      'import/order': [
        'error',
        {
          groups: [
            'builtin',   // node:http, fs, path
            'external',  // express, dotenv
            'internal',  // aliases like @/...
            ['parent', 'sibling', 'index'], // ../ ./ ./index
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // ✅ This disables ESLint formatting rules that conflict with Prettier
  prettier,
]);
