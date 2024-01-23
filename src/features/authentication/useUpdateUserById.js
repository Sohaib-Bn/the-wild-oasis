import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserById as updateUserByIdApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUserById() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updateUserById } = useMutation({
    mutationFn: updateUserByIdApi,
    onSuccess: () => {
      toast.success("User successfully updated");
      queryClient.invalidateQueries({ active: true });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isPending, updateUserById };
}
