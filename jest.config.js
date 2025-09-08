module.exports = {
  projects: [
    {
      displayName: 'backend',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/src'],
      testMatch: ['<rootDir>/src/**/__tests__/**/*.+(ts|js)', '<rootDir>/src/**/*.(test|spec).+(ts|js)'],
      transform: { '^.+\\.(ts)$': 'ts-jest' },
      testTimeout: 30000
    },
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/client/src'],
      testMatch: ['<rootDir>/client/src/**/__tests__/**/*.+(ts|tsx)', '<rootDir>/client/src/**/*.(test|spec).+(ts|tsx)'],
      transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
      moduleNameMapping: { '\\.(css|less|scss|sass)$': 'identity-obj-proxy' },
      setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts']
    }
  ],
  collectCoverageFrom: [
    'src/**/*.{ts}',
    'client/src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!client/src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage'
};