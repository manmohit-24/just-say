import { useMutation, useQuery } from "@tanstack/react-query";

import { forgotPassword, login, logout, register, resetPassword, verifyEmail } from "./api";

const useLogin = () => useMutation({ mutationFn: login });

const useRegister = () => useMutation({ mutationFn: register });

const useLogout = () => useMutation({ mutationFn: logout });

const useForgotPassword = () => useMutation({ mutationFn: forgotPassword });

const useResetPassword = () => useMutation({ mutationFn: resetPassword });

// The token in the email link can only be used once, so this must not be retried or refetched.
// As a query (not an effect) the request is also sent only once when React Strict Mode runs twice.
const useVerifyEmail = (token: string) =>
  useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail({ token }),
    retry: false,
    staleTime: Infinity,
  });

export { useLogin, useRegister, useLogout, useForgotPassword, useResetPassword, useVerifyEmail };
