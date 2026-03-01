// Jest setup file for ChefMatch
// Add global test configuration and mocks here

// Silence console warnings in tests unless debugging
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('deprecated')) return;
  originalWarn(...args);
};
