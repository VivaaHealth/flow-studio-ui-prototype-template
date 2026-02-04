import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.next/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      'public/**',
    ],
  },

  // Base JS/TS config
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React + TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Enforce design system typography
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mui/material',
              importNames: ['Typography'],
              message: 'Use Text/Title from @vivaahealth/design-system instead.',
            },
          ],
        },
      ],

      // Warn about inline data arrays (encourage using fixtures)
      // Disabled for files in fixtures/ directory - see override below
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            'VariableDeclaration[declarations.0.init.type="ArrayExpression"][declarations.0.init.elements.length>5]',
          message: 'Large inline arrays should be moved to lib/mock-data/fixtures/',
        },
      ],

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Disable large array warning for fixture files (that's where they belong!)
  {
    files: ['**/fixtures/**/*.ts', '**/fixtures/**/*.tsx'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  }
);
