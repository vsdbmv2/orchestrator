// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "eslint-config-prettier"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "eslint-plugin-prettier"],
	rules: {
		"prettier/prettier": "error",
		semi: ["error", "always"],
		quotes: ["error", "double"],
		"comma-spacing": ["error", { before: false, after: true }],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ varsIgnorePattern: "^_", argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
		],
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"prefer-const": ["warn"],
	},
};
