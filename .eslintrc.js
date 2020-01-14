module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },

  env: {
    node: true,
    jest: true,
  },

  plugins: ['jest'],

  'extends': [
    'eslint:recommended',
    'plugin:jest/recommended',
  ],

  rules: {
    'arrow-spacing': ['error', {
      before: true,
      after: true,
    }],
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'camelcase': [
      'error',
      {
        ignoreDestructuring: false,
        ignoreImports: false,
        properties: 'always',
      }
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', {
      before: false,
      after: true,
    }],
    'curly': ['error', 'all'],
    'default-case': 'error',
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    'eol-last': ['error', 'always'],
    'eqeqeq': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'generator-star-spacing': ['error', 'both'],
    'indent': ['error', 2],
    'key-spacing': ['error', {
      beforeColon: false,
      afterColon: true,
      mode: 'strict',
    }],
    'keyword-spacing': ['error', {
      before: true,
      after: true,
    }],
    'newline-per-chained-call': 'error',
    'no-empty-function': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'no-sequences': 'error',
    'no-whitespace-before-property': 'error',
    'object-property-newline': 'error',
    'quotes': ['error', 'single'],
    'rest-spread-spacing': ['error', 'never'],
    'semi': ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'yield-star-spacing': ['error', 'both'],
    'yoda': ['error', 'never'],
  }
}
