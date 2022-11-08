module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.(t|j)sx?$': ['@swc/jest'] },
  testMatch: ['<rootDir>/test/**/*.(spec|test).(t|j)s'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*'],
  coverageReporters: ['text', 'lcov', 'cobertura'],
  coverageDirectory: './coverage',
}
