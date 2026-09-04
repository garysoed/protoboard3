import './pages/placeholder-pages.js';

/**
 * Route mapping table associating URL hash routes with custom element tag names.
 */
export const ROUTE_MAP: ReadonlyMap<string, string> = new Map([
  ['#overview', 'pbd-page-overview'],
  ['#d1', 'pbd-page-d1'],
  ['#d2', 'pbd-page-d2'],
  ['#d4', 'pbd-page-d4'],
  ['#d6', 'pbd-page-d6'],
  ['#d8', 'pbd-page-d8'],
  ['#d12', 'pbd-page-d12'],
  ['#d20', 'pbd-page-d20'],
  ['#dn', 'pbd-page-dn'],
  ['#slot', 'pbd-page-slot'],
  ['#deck', 'pbd-page-deck'],
  ['#bag', 'pbd-page-bag'],
  ['#chute', 'pbd-page-chute'],
  ['#hand-overlay', 'pbd-page-hand-overlay'],
  ['#action-popup', 'pbd-page-action-popup'],
]);

export const DEFAULT_ROUTE = '#overview';

/**
 * Synchronizes the active state across Carbon SideNav links and parent menus.
 */
function syncNavState(hash: string): void {
  const navLinks = document.querySelectorAll(
    'cds-side-nav-link, cds-side-nav-menu-item',
  );
  const activeMenus = new Set<Element>();

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href === hash;
    link.toggleAttribute('active', isActive);

    if (isActive) {
      const parentMenu = link.closest('cds-side-nav-menu');
      if (parentMenu) {
        activeMenus.add(parentMenu);
        parentMenu.setAttribute('expanded', '');
        parentMenu.toggleAttribute('active', true);
      }
    }
  });

  const allMenus = document.querySelectorAll('cds-side-nav-menu');
  allMenus.forEach((menu) => {
    if (!activeMenus.has(menu)) {
      menu.toggleAttribute('active', false);
    }
  });
}

/**
 * Updates the container content and nav link state from window.location.hash.
 */
function updateHashFromLocation(container: HTMLElement): void {
  const hash = window.location.hash.trim();
  const tagName = ROUTE_MAP.get(hash);

  if (!tagName) {
    window.location.hash = DEFAULT_ROUTE;
    return;
  }

  container.replaceChildren();
  const pageElement = document.createElement(tagName);
  container.appendChild(pageElement);
  syncNavState(hash);
}

/**
 * Initializes the client-side hash router on the given container.
 */
export function initializeRouter(container: HTMLElement): void {
  const update = (): void => updateHashFromLocation(container);

  window.addEventListener('hashchange', update);
  window.addEventListener('popstate', update);
  window.addEventListener('DOMContentLoaded', update);

  update();
}
