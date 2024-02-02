import { useQuery } from "@tanstack/react-query";
import { getBills } from "../../services/apiRestaurant";
import { useParams } from "react-router-dom";

export function useBills() {
  const { bookingId } = useParams();

  const {
    isLoading,
    data: bills,
    error,
  } = useQuery({
    queryKey: ["bills"],
    queryFn: () => getBills(bookingId),
  });

  return { isLoading, bills, error };
}
