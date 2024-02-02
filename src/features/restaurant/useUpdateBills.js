import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBills as updateBillsApi } from "../../services/apiRestaurant";
import toast from "react-hot-toast";

export function useUpdateBills(toasts = true) {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateBills } = useMutation({
    mutationKey: ["bills"],
    mutationFn: ({ bookingId, updatedData }) =>
      updateBillsApi({ bookingId, updatedData }),

    onSuccess: () => {
      toasts && toast.success("Bills successfully updated");
      queryClient.invalidateQueries({ queryKey: ["billsS"] });
    },

    onError: (err) => toasts && toast.error(err.message),
  });

  return { isUpdating, updateBills };
}
