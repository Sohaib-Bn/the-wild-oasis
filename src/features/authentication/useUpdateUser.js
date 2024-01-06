import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser as updateUserApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: updateUser } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      toast.success("Your Account successfully updated");
      queryClient.invalidateQueries(["user"]);
    },
    onError: () => toast.error("There was problem. Try again"),
  });

  return { isLoading, updateUser };
}
