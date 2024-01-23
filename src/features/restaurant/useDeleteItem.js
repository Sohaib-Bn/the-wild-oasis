import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem as deleteItemApi } from "../../services/apiRestaurant";
import toast from "react-hot-toast";

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: deleteItem } = useMutation({
    mutationKey: ["menu"],
    mutationFn: (id) => deleteItemApi(id),
    onSuccess: (item) => {
      toast.success(`${item.name} successfully delted`);
      queryClient.invalidateQueries(["menu"]);
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteItem };
}
