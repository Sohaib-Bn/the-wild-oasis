import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMenu } from "../../services/apiRestaurant";
import { useSearchParams } from "react-router-dom";
import { MAX_RESULT_PER_PAGE } from "../../utils/constants";

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
  let page;
  page = Number(searchParams.get("page")) || 1;

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

  if (allMenu) return { isLoading, menu, count };

  // PREFETCHING

  const pageCount = Math.ceil(count / MAX_RESULT_PER_PAGE);

  if (page > pageCount) {
    page = pageCount;
    searchParams.set("page", page);
    setSearchParams(searchParams);
  }

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
