type Protoboard = typeof import('./src/index');

declare global {
  interface Window {
    Protoboard: Protoboard;
  }
}

export {};
