import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/modules/auth";

export const metadata: Metadata = { title: "Forgot Password" };

const ForgotPasswordPage = () => <ForgotPasswordForm />;

export default ForgotPasswordPage;
