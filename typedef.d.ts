type Protoboard = typeof import('./src/testing/index');

declare global {
  interface Window {
    Protoboard: Protoboard;
  }
}

export {};
