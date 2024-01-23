import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateItem } from "../../services/apiRestaurant";
import toast from "react-hot-toast";

export function useCreateItem() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createItem } = useMutation({
    mutationKey: ["menu"],
    mutationFn: (newItemObj) => createUpdateItem({ newItemObj }),
    onSuccess: () => {
      toast.success("New item added to the menu");
      queryClient.invalidateQueries(["restauratn"]);
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createItem };
}
