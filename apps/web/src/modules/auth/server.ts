// server only exports, kept apart so client components never import them by accident
export { getCurrentUser, redirectIfAuthenticated } from "./auth.server";
