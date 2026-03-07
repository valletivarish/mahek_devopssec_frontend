// ESLint configuration for the Event RSVP Manager React frontend
// Uses recommended React rules and Vite-specific refresh plugin
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.3',
    },
  },
  plugins: ['react-refresh'],
  rules: {
    // Allow export of components for Vite hot module replacement
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Prop types validation disabled since we use Yup schemas for validation
    'react/prop-types': 'off',
    // Allow unused variables prefixed with underscore
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
