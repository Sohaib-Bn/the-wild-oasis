import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import toast from "react-hot-toast";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

function CabinTable() {
  const { isLoading, cabins, error } = useCabins();
  const [searchParams] = useSearchParams();

  // FILTERING

  const filterType = searchParams.get("discount") || "all";
  let filteredCabins = [];

  if (filterType === "all") filteredCabins = cabins;
  if (filterType === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterType === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount !== 0);

  // SORTING

  const sortBy = searchParams.get("sortBy") || "regularPrice-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "desc" ? -1 : 1;

  filteredCabins?.sort((a, b) => (a[field] - b[field]) * modifier);

  if (isLoading) return <Spinner />;
  if (error) {
    toast.error(error.message);
  }

  return (
    <Menus>
      <Table columns={" 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr"}>
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
        </Table.Header>
        <Table.Body
          data={filteredCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
