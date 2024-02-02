import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking as updateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isCheckingout, mutate: checkout } = useMutation({
    mutationFn: (id) =>
      updateBookingApi(id, {
        status: "checked-out",
        isPaid: true,
      }),

    onSuccess: (data) => {
      toast.success(`Booking ${data.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });
      navigate("/");
    },
    onError: () => toast.error("Booking faild while checking out"),
  });

  return { isCheckingout, checkout };
}
