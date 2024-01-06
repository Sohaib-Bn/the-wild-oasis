import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../services/apiBookings";
import { subDays } from "date-fns";

export function useStaysAfterDate() {
  const [searchParams] = useSearchParams();
  const lastDays = searchParams.get("last")
    ? Number(searchParams.get("last"))
    : 7;

  const date = subDays(new Date(), lastDays).toISOString();

  const {
    isLoading,
    data: staysAfterDate,
    error,
  } = useQuery({
    queryKey: ["stays", `last ${lastDays} days`],
    queryFn: () => getStaysAfterDate(date),
  });

  const confirmedStaysAfterDate = staysAfterDate?.filter(
    (stay) => stay.status === "checked-in" || stay.status === "checked-out"
  );

  return {
    isLoading,
    staysAfterDate,
    error,
    confirmedStaysAfterDate,
    lastDays,
  };
}
