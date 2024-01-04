module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        '@bl0ggy/eslint-config/base-react-ts.js',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        'no-console': 0,
    },
    'globals': {
    },
};
