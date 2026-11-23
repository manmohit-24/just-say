import type { Metadata } from "next";

import { RegisterForm } from "@/modules/auth";

export const metadata: Metadata = { title: "Register" };

const RegisterPage = () => <RegisterForm />;

export default RegisterPage;
