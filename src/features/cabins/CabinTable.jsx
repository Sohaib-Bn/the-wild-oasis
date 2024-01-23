import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useCabins } from "./useCabins";
import { useSearchParams } from "react-router-dom";
import { useBookings } from "../bookings/useBookings";

function CabinTable() {
  const { isLoading: isLoading1, cabins } = useCabins();
  const { isLoading: isLoading2, bookings } = useBookings(false);

  const [searchParams] = useSearchParams();

  if (isLoading1 || isLoading2) return <Spinner />;

  // FILTERING

  const filterValue = searchParams.get("status") || "all";
  let filteredCabins = [];

  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "active")
    filteredCabins = cabins.filter((cabin) => cabin.status === "active");
  if (filterValue === "idel")
    filteredCabins = cabins.filter((cabin) => cabin.status === "idel");
  if (filterValue === "unavailable")
    filteredCabins = cabins.filter((cabin) => cabin.status === "unavailable");

  // SORTING

  const sortBy = searchParams.get("sortBy") || "regularPrice-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "desc" ? -1 : 1;

  filteredCabins?.sort((a, b) => (a[field] - b[field]) * modifier);

  return (
    <Menus>
      <Table columns={" 0.6fr 1.3fr 2fr 1.3fr 1fr 1fr 0.3fr"}>
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div>Status</div>
        </Table.Header>
        <Table.Body
          data={filteredCabins}
          render={(cabin) => (
            <CabinRow cabin={cabin} bookings={bookings} key={cabin.id} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
