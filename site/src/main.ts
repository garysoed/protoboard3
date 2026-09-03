import '@carbon/web-components/es/components/ui-shell/index.js';

/**
 * Initializes the Protoboard documentation and explorer application.
 */
export function initializeSite(): void {
  window.Protoboard.initialize();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => initializeSite());
} else {
  initializeSite();
}
