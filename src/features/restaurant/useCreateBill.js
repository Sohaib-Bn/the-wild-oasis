import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBill as createBillApi } from "../../services/apiRestaurant";
import toast from "react-hot-toast";

export function useCreateBill() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createBill } = useMutation({
    mutationKey: ["bills"],
    mutationFn: (billData) => createBillApi(billData),
    onSuccess: () => {
      toast.success("Bill successfully created");
      queryClient.invalidateQueries(["bills"]);
    },

    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createBill };
}
