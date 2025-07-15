import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import neo from 'neostandard'

export default [
  ...neo({
    ts: true
  }),
  eslintPluginPrettierRecommended,
  {
    rules: {
      '@stylistic/space-before-function-paren': 'off',
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
    }
  }
]
