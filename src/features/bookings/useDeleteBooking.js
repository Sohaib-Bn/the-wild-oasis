import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookinApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { isLoading, mutate: deleteBooking } = useMutation({
    mutationFn: deleteBookinApi,
    onSuccess: () => {
      toast.success(`Booking successfully deleted`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isLoading, deleteBooking };
}
