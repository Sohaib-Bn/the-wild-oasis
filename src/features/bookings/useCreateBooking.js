import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createBooking } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success("booking successfully created");
      queryClient.invalidateQueries({ active: true });
    },

    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createBooking };
}
