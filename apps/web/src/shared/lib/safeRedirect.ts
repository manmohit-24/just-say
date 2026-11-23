// only in-app paths are followed, so a crafted ?next= can't send people to another site
const safeRedirect = (path: string | undefined, fallback = "/dashboard") =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : fallback;

export { safeRedirect };
