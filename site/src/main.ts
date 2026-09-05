import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/data-table/index.js';
import '@carbon/web-components/es/components/link/index.js';
import '@carbon/web-components/es/components/tag/index.js';
import '@carbon/web-components/es/components/ui-shell/index.js';

import {initializeRouter} from './router.js';

/**
 * Sets up the header menu button toggle listener to synchronize SideNav state.
 */
function initializeNavToggle(): void {
  document.addEventListener('cds-header-menu-button-toggled', (event) => {
    if (
      event instanceof CustomEvent &&
      typeof event.detail?.active === 'boolean'
    ) {
      const sideNav = document.querySelector('cds-side-nav');
      if (sideNav instanceof HTMLElement) {
        sideNav.toggleAttribute('expanded', event.detail.active);
      }
    }
  });
}

/**
 * Initializes the Protoboard documentation and explorer application.
 */
export function initializeSite(): void {
  window.Protoboard.initialize();
  initializeNavToggle();

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
