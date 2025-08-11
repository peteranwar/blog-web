// import '@testing-library/jest-dom';

// require('@testing-library/jest-dom');


// Mock localStorage
const mockLocalStorage = {
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = String(value);
    },
    clear() {
      this.store = {};
    }
  };
  
  // Make localStorage available globally
  global.localStorage = mockLocalStorage;
  
  // Mock BroadcastChannel
  class MockBroadcastChannel {
    name;
    onmessage = null;
  
    constructor(name) {
      this.name = name;
    }
  
    postMessage(message) {
      // Simulate receiving the message
      if (this.onmessage && typeof window !== 'undefined') {
        queueMicrotask(() => {
          this.onmessage({ data: message });
        });
      }
    }
  
    close() {
      this.onmessage = null;
    }
  }
  
  // Make BroadcastChannel available globally
  global.BroadcastChannel = MockBroadcastChannel;