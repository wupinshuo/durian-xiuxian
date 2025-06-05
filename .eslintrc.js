// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

module.exports = {
  extends: [
    "next",
    "prettier",
    "react-app",
    "react-app/jest",
    "plugin:storybook/recommended",
    "plugin:tailwindcss/recommended",
  ],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  rules: {
    // 没有用到的屏幕查询，不报错
    "tailwindcss/no-custom-classname": "off",
    // 没有用到的屏幕查询，不报错
    "testing-library/prefer-screen-queries": "off",
    // 没有用到的html链接，不报错
    "@next/next/no-html-link-for-pages": "off",
    // 没有用到的变量，不报错
    "@typescript-eslint/no-unused-vars": "off",
    // 用 let 声明但从未被重新赋值
    "prefer-const": "off",
    // 任何类型，不报错
    "@typescript-eslint/no-explicit-any": "off",
    // '@typescript-eslint/no-unused-vars': [
    //   'warn',
    //   {
    //     argsIgnorePattern: '^_',
    //     varsIgnorePattern: '^_',
    //   },
    // ],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "react-hooks/exhaustive-deps": "off",
    "tailwindcss/classnames-order": "off",
    "import/order": [
      1,
      {
        groups: [
          "external",
          "builtin",
          "internal",
          "sibling",
          "parent",
          "index",
        ],
        pathGroups: [
          ...getDirectoriesToSort().map((singleDir) => ({
            pattern: `${singleDir}/**`,
            group: "internal",
          })),
          {
            pattern: "env",
            group: "internal",
          },
          {
            pattern: "theme",
            group: "internal",
          },
          {
            pattern: "public/**",
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};

function getDirectoriesToSort() {
  const ignoredSortingDirectories = [
    ".git",
    ".next",
    ".vscode",
    "node_modules",
  ];
  return getDirectories(process.cwd()).filter(
    (f) => !ignoredSortingDirectories.includes(f)
  );
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}
