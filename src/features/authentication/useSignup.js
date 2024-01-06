import { useMutation } from "@tanstack/react-query";
import { singupUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { isLoading, mutate: signup } = useMutation({
    mutationFn: ({ email, password, fullname }) =>
      singupUser({ email, password, fullname }),
    onSuccess: () => {
      toast.success("Verify your email address ");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isLoading, signup };
}
