import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsconfig from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import checkFile from 'eslint-plugin-check-file';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'structured-clone';
const { structuredClone: clone } = pkg;

globalThis.structuredClone = globalThis.structuredClone || clone;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,

  {
    ignores: ['eslint.config.js'],
  },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsconfig,
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        process: 'readonly',
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      unicorn,
      'check-file': checkFile,
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@/no-console':'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false, // Disallows omitting return types for function expressions
          allowTypedFunctionExpressions: true, // Allows typed function expressions
          allowHigherOrderFunctions: true, // Allows functions returning other functions
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase'] },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE', 'camelCase'],
        },
        {
          selector: 'variable',
          modifiers: ['exported'],
          format: ['PascalCase', 'camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase'],
          modifiers: ['exported'],
          types: ['function'],
        },
        { selector: 'enum', format: ['PascalCase'], suffix: ['Enum'] },
        { selector: 'enumMember', format: ['UPPER_CASE', 'snake_case'] },
        { selector: 'function', format: ['camelCase'] },
        {
          selector: 'interface',
          format: ['PascalCase'],
          suffix: ['Interface'],
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
    },
  },
];
