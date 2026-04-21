/**
 * Matches a pathname against a navigation target.
 * Treats paths as active when the current location equals the target
 * or is a child of it. Handles trailing slashes and the root route.
 */
export function isActivePath(pathname, href) {
  if (!href) return false;
  if (href === '/') return pathname === '/' || pathname === '';

  const normalized = href.endsWith('/') ? href.slice(0, -1) : href;
  return (
    pathname === normalized ||
    pathname === `${normalized}/` ||
    pathname.startsWith(`${normalized}/`)
  );
}
