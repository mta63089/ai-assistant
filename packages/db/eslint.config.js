import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import neo from 'neostandard';

export default [
  ...neo({
    ts: true
  }),
  {
    languageOptions: {
      tsConfigRootDir: './tsconfig.json'
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          'space-before-function-paren': 'off'
        }
      ],
      '@stylistic/space-before-function-paren': ['error', 'off'],
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'never',
          objects: 'never',
          imports: 'never',
          exports: 'never',
          functions: 'never'
        }
      ]
    },
    ignores: ['dist', 'node_modules']
  },
  eslintPluginPrettierRecommended
];
