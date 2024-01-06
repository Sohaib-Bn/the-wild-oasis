import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { MAX_RESULT_PER_PAGE } from "../../utils/constants";

export function useBookings() {
  const [searchParams] = useSearchParams();
  const client = useQueryClient();

  // FILTERING
  const filterValue = searchParams.get("status");
  const filterObj =
    !filterValue || filterValue === "all"
      ? null
      : {
          field: "status",
          value: `${filterValue}`,
          methos: "eq",
        };

  // SORTING

  const sortByValue = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortByValue.split("-");
  const sorByObj = { field, direction };

  // PAGINATION

  const page = Number(searchParams.get("page")) || 1;

  const {
    data: { data: bookings, count } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", filterObj, sorByObj, page],
    queryFn: () => getBookings(filterObj, sorByObj, page),
  });

  // PRE-FETCHING

  const pageCount = Math.ceil(count / MAX_RESULT_PER_PAGE);

  if (page < pageCount)
    client.prefetchQuery({
      queryKey: ["bookings", filterObj, sorByObj, page + 1],
      queryFn: () => getBookings(filterObj, sorByObj, page + 1),
    });

  if (page > 1)
    client.prefetchQuery({
      queryKey: ["bookings", filterObj, sorByObj, page - 1],
      queryFn: () => getBookings(filterObj, sorByObj, page - 1),
    });

  return { bookings, count, isLoading, error };
}
