module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "standard"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "space-before-function-paren": 0,
    "react/react-in-jsx-scope": 0,
    "comma-dangle": 0,
    "multiline-ternary": 0,
    quotes: 0,
    semi: 0,
  },
  globals: {
    JSX: true,
  },
};
