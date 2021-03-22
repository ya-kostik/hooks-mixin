module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 8
  },
  extends: ['eslint:recommended'],
  rules: {
      'no-console': ['error', { 'allow': ['warn', 'error', 'info', 'dir'] }],
  },
  globals: {}
}
