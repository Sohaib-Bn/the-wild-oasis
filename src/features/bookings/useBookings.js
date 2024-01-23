import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { MAX_RESULT_PER_PAGE } from "../../utils/constants";

export function useBookings(allBookings = false) {
  const [searchParams, setSearchParams] = useSearchParams();
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

  let page;
  page = Number(searchParams.get("page")) || 1;

  const {
    data: { data: bookings, count } = {},
    isLoading,
    error,
  } = useQuery(
    !allBookings
      ? {
          queryKey: ["bookings", filterObj, sorByObj, page],
          queryFn: () => getBookings(filterObj, sorByObj, page),
        }
      : {
          queryKey: ["bookings"],
          queryFn: () => getBookings(),
        }
  );

  if (allBookings) return { bookings, isLoading, error };

  // PRE-FETCHING

  const pageCount = Math.ceil(count / MAX_RESULT_PER_PAGE);

  if (page > pageCount) {
    page = pageCount;
    searchParams.set("page", page);
    setSearchParams(searchParams);
  }

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
