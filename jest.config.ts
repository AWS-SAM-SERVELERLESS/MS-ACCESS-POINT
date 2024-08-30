/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/tests/unit/*.test.ts'],
    coverageThreshold: {
        global: {
          branches: 50,  // Porcentaje mínimo de cobertura de branches
          functions: 50, // Porcentaje mínimo de cobertura de funciones
          lines: 50,     // Porcentaje mínimo de cobertura de líneas
          statements: 50 // Porcentaje mínimo de cobertura de statements
        },
    },
};
