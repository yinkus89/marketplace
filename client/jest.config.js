module.exports = {
    preset: 'react',
    testEnvironment: 'jsdom',  // Useful for React testing
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
  };
  