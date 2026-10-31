import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/*.test.ts'],
  transform: {
    '^.+\\.ts?$': ['ts-jest', { isolatedModules: true }]
  }
}

// export = config
export default config
