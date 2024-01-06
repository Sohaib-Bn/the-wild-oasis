import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";

export function useTodayBookings() {
  const { isLoading, data: activeBookings } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ["active-bookings"],
  });

  return { isLoading, activeBookings };
}
