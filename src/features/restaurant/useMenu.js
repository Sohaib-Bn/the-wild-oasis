import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMenu } from "../../services/apiRestaurant";
import { useSearchParams } from "react-router-dom";
import { MAX_RESULT_PER_PAGE } from "../../utils/constants";
import { useEffect, useMemo } from "react";

export function useMenu(allMenu = false) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // FILTERTING
  const filterValue = searchParams.get("status") || "all";
  const filterObj =
    filterValue !== "all" ? { field: "status", value: filterValue } : null;

  // SORTING
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const sortByObj = { field, direction };

  //PAGINATION
  const page = useMemo(
    () => Number(searchParams.get("page")) || 1,
    [searchParams]
  );

  const { isLoading, data: { data: menu, count } = {} } = useQuery(
    !allMenu
      ? {
          queryKey: [
            "menu",
            { status: filterValue },
            { field: field, direction: direction },
            page,
          ],
          queryFn: () => getMenu({ filterObj, sortByObj, page }),
        }
      : {
          queryKey: ["menu"],
          queryFn: getMenu,
        }
  );

  const pageCount = Math.ceil(count / MAX_RESULT_PER_PAGE);

  useEffect(() => {
    if (page > pageCount) {
      const updatedPage = pageCount;
      if (pageCount !== 0) {
        searchParams.set("page", updatedPage);
        setSearchParams(searchParams);
      } else {
        searchParams.delete("page");
        setSearchParams(searchParams);
      }
    }
  }, [page, pageCount, searchParams, setSearchParams]);

  // PREFETCHING

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: [
        "menu",
        { status: filterValue },
        { field: field, direction: direction },
        page + 1,
      ],
      queryFn: () => getMenu({ filterObj, sortByObj, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: [
        "menu",
        { status: filterValue },
        { field: field, direction: direction },
        page - 1,
      ],
      queryFn: () => getMenu({ filterObj, sortByObj, page: page - 1 }),
    });

  return { isLoading, menu, count };
}
