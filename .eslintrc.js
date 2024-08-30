module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020, // Permite el uso de características modernas de ECMAScript
    sourceType: "module", // Permite el uso de imports de ES6
    ecmaFeatures: {
      jsx: true, // Habilitar JSX si trabajas con React
    },
  },
  extends: [
    "plugin:@typescript-eslint/recommended", // Reglas recomendadas para TypeScript
    "plugin:prettier/recommended", // Activa prettier y muestra errores de formato como errores de ESLint
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off", // Desactivar la obligación de declarar tipos de retorno
    "@typescript-eslint/no-explicit-any": "warn", // Evitar el uso de 'any', pero solo advertencias
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Ignorar variables no usadas que comiencen con '_'
    "prettier/prettier": ["error", { endOfLine: "auto" }], // Asegura la consistencia en saltos de línea
    "@typescript-eslint/consistent-type-imports": "error", // Enforce consistent usage of type imports
  },
  ignorePatterns: ["node_modules/", "dist/"], // Ignorar directorios que no deben ser validados
};
