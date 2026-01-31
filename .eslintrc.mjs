export default {
    env: {
      node: true,
      es2022: true,
      browser: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:astro/recommended",
      "prettier"
    ],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    overrides: [
      {
        files: ["*.astro"],
        parser: "astro-eslint-parser",
        parserOptions: {
          parser: "@typescript-eslint/parser",
          extraFileExtensions: [".astro"],
        },
        rules: {
          // override/add rules settings here, such as:
          // "astro/no-set-html-directive": "error"
        },
      },
    ],
  }