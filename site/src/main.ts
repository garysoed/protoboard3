import '@carbon/web-components/es/components/ui-shell/index.js';
import {initializeRouter} from './router.js';

/**
 * Initializes the Protoboard documentation and explorer application.
 */
export function initializeSite(): void {
  window.Protoboard.initialize();

  const middlePane = document.getElementById('middle-pane');
  if (middlePane instanceof HTMLElement) {
    initializeRouter(middlePane);
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => initializeSite());
} else {
  initializeSite();
}
