module.exports = {
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/database/**',
    '!<rootDir>/src/models/**',
    '!<rootDir>/src/server.ts'
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'babel',
  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/tests',
    '<rootDir>/src'
  ],
  // A map from regular expressions to paths to transformers
  transform: {
    '\\.ts$': 'ts-jest'
  },
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true
}
