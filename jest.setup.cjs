// import '@testing-library/jest-dom';

// require('@testing-library/jest-dom');

const mockLocalStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = String(value); },
    clear() { this.store = {}; }
  };
  
  global.localStorage = mockLocalStorage;
  
  class MockBroadcastChannel {
    name;
    onmessage = null;
    constructor(name) { this.name = name; }
    postMessage(msg) {
      if (this.onmessage && typeof window !== 'undefined') {
        queueMicrotask(() => this.onmessage({  msg }));
      }
    }
    close() { this.onmessage = null; }
  }
  
  global.BroadcastChannel = MockBroadcastChannel;