import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser as deleteUserApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const { isPending, mutate: deleteUser } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success(`User successfully deleted`);
      queryClient.invalidateQueries(["allUsers"]);
    },

    onError: (err) => toast.error(err.message),
  });

  return { isPending, deleteUser };
}
