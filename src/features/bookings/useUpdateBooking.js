import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking as updateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useUpdateBooking(toasts = true) {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateBooking } = useMutation({
    mutationKey: ["bookings"],
    mutationFn: ({ id, bookingObj }) => updateBookingApi(id, bookingObj),

    onSuccess: (booking) => {
      toasts && toast.success(`Booking #${booking.id} successfully updated`);
      queryClient.invalidateQueries(["bookings"]);
      queryClient.removeQueries({ queryKey: ["booking", `${booking.id}`] });
    },

    onError: (err) => toasts && toast.error(err.message),
  });

  return { isUpdating, updateBooking };
}
