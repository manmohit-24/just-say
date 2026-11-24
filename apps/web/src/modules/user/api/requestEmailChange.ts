import { apiFetch } from "@/shared/api";

const requestEmailChange = () => apiFetch<null>("/user/me/email/request", { method: "POST" });

export { requestEmailChange };
