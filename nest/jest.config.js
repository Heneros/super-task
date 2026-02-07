module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '^@/prisma/(.*)$': '<rootDir>/src/prisma/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
    '^@/data$': '<rootDir>/src/data/$1',
    '^@/redis/(.*)$': '<rootDir>/src/redis/$1',
    '^@/superheroes/(.*)$': '<rootDir>/src/superheroes/$1',
  },

  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
