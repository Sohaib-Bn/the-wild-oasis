import { useMutation } from "@tanstack/react-query";
import { singupUser } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { isPending, mutate: signup } = useMutation({
    mutationFn: singupUser,
    onSuccess: () => {
      toast.success("Verify the email address ");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isPending, signup };
}
