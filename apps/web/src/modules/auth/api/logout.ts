import { apiFetch } from "@/shared/api";

const logout = () => apiFetch<null>("/auth/logout", { method: "POST" });

export { logout };
