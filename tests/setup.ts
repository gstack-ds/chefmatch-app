// Jest setup file for ChefMatch
// Add global test configuration and mocks here

// Mock expo-secure-store for auth token persistence
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Silence console warnings in tests unless debugging
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('deprecated')) return;
  originalWarn(...args);
};
