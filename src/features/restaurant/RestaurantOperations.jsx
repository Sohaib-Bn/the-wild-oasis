import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import SortBy from "../../ui/SortBy";
import CreateItemModal from "./CreateItemModal";

function RestaurantOperations() {
  return (
    <TableOperations>
      <CreateItemModal />
      <Filter
        filterField="status"
        options={[
          {
            label: "All",
            value: "all",
          },
          {
            label: "Available",
            value: "available",
          },
          {
            label: "Unavailable",
            value: "unavailable",
          },
        ]}
      />
      <SortBy
        $type="white"
        options={[
          {
            label: "Name (A-Z)",
            value: "name-asc",
          },
          {
            label: "Price (hight first)",
            value: "price-desc",
          },
          {
            label: "Price (low first)",
            value: "price-asc",
          },
        ]}
      />
    </TableOperations>
  );
}

export default RestaurantOperations;
