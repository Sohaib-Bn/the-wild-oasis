import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";
import { subDays } from "date-fns";

export function useBookingsAfterDate() {
  const [searchParams] = useSearchParams();
  const lastDays = searchParams.get("last")
    ? Number(searchParams.get("last"))
    : 7;

  const date = subDays(new Date(), lastDays).toISOString();
  const {
    isLoading,
    data: bookingsAfterDate,
    error,
  } = useQuery({
    queryKey: ["bookings", `last ${lastDays} days`],
    queryFn: () => getBookingsAfterDate(date),
  });

  return { isLoading, bookingsAfterDate, error };
}
