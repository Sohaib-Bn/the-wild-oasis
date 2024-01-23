import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateItem } from "../../services/apiRestaurant";
import toast from "react-hot-toast";

export function useUpdateItem() {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateItem } = useMutation({
    mutationKey: ["menu"],
    mutationFn: ({ id, newItemObj }) => createUpdateItem({ id, newItemObj }),
    onSuccess: (item) => {
      toast.success(`${item.name} successfully updated`);
      queryClient.invalidateQueries(["menu"]);
    },

    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateItem };
}
