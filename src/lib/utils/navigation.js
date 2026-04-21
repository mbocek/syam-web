/**
 * Matches a pathname against a navigation target.
 *
 * By default active is "this route or any descendant" so parent groups light
 * up while the user is deeper inside them. Pass `exact = true` for links
 * that should only highlight on an exact match (useful for a group's index
 * link when siblings share the same prefix).
 */
export function isActivePath(pathname, href, exact = false) {
  if (!href) return false;
  if (href === '/') return pathname === '/' || pathname === '';

  const normalized = href.endsWith('/') ? href.slice(0, -1) : href;
  if (exact) return pathname === normalized || pathname === `${normalized}/`;

  return (
    pathname === normalized ||
    pathname === `${normalized}/` ||
    pathname.startsWith(`${normalized}/`)
  );
}
