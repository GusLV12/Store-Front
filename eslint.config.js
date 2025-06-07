import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ──────────────────────────────────────────────
      // 🔹 Reglas para importaciones (eslint-plugin-import)
      // ──────────────────────────────────────────────
      'import/extensions': ['warn', 'ignorePackages', {
        js: 'never',
        jsx: 'never'
      }], // Obliga a omitir las extensiones en importaciones
      'import/no-unresolved': ['warn'], // Evita importar módulos que no existen
      'import/order': ['warn', {
        'groups': ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always'
      }], // Organiza las importaciones en bloques separados

      // 'import/no-unused-modules': ['warn', { unusedExports: true }], // Detecta módulos no utilizados

      'semi': ['warn', 'always'],
      'indent': ['warn', 2],
      'quotes': ['warn', 'single'],
      'no-trailing-spaces': 'warn',
      'eol-last': ['warn', 'always'],
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'eqeqeq': ['warn', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never'],
      'prefer-template': 'warn',
      'jsx-quotes': ['warn', 'prefer-double'],

    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx']
        },
        node: {
          extensions: ['.js', '.jsx'] // 🔹 Permite omitir extensiones en imports
        }
      }
    }
  },
];
