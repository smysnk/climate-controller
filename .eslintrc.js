const path = require('path');
const baseRules = require('eslint-config-airbnb-base/rules/style');
const [_, ...restricted] = baseRules.rules['no-restricted-syntax'];

module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    jsx: true,
  },
  env: {
    node: true,
    browser: true,
    'jest/globals': true,
  },
  plugins: [
    'babel',
    'import',
    'jsx-a11y',
    'compat',
    'jest',
  ],
  rules: {
    // Spacing
    'template-curly-spacing': ['error', 'always'],

    // General
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'quote-props': 0,
    'prefer-const': 0,
    'consistent-return': 0,
    'no-unused-vars': 'warn',
    'no-console': 0,
    'max-len': ['error', { 'code': 130 }],
    'padded-blocks': ['error', 'always'],
    'arrow-parens': 0,
    'function-paren-newline': ['error', 'consistent'],
    'object-curly-newline': ['error', { consistent: true }],
    'no-plusplus': 0,
    'linebreak-style': 0,
    'global-require': 0,
    'no-restricted-syntax': [2,
      ...restricted.filter(
        r => !['ForOfStatement'].includes(r.selector)
      ),
    ],

    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
        'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 },
        'outerIIFEBody': 1,
        'MemberExpression': 1,
        'FunctionDeclaration': {'body': 1, 'parameters': 2},
        'FunctionExpression': {'body': 1, 'parameters': 2},
        'CallExpression': {'arguments': 1},
        'ArrayExpression': 1,
        'ObjectExpression': 1,
        'ignoredNodes': [ 'JSXAttribute', 'JSXSpreadAttribute', ]
      }
    ],

    // React
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/forbid-prop-types': [1, { forbid: ['any']} ],
    'react/prefer-stateless-function': [2, { ignorePureComponents: true }],
    'react/no-multi-comp': 0,
    'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
    'react/jsx-curly-spacing': [2, {
      'when': 'always', 
      'allowMultiline': false, 
      'spacing': {'objectLiterals': 'never'}
    }],
    'react/prop-types': [1, {
      ignore: [
        // `dispatch` is typically used by Redux `@connect`
        'dispatch',
        // `data` is injected by Apollo
        'data',
      ],
    }],

    // Import
    'import/no-unresolved': [2, { commonjs: true }],

    // Compat
    'compat/compat': 0,

    // JSX-a11y
    'jsx-a11y/anchor-is-valid': [ 'error', {
      'components': [ 'a' ],
      'aspects': [ 'noHref', 'invalidHref', 'preferButton' ]
    }],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [
          'lib',
          'argparse',
          'node_modules',
        ],
      },
    },
  },
  globals: {
    SERVER: false,
  },
};