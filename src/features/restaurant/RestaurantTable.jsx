import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import RestaurantRow from "./RestaurantRow";
import { useMenu } from "./useMenu";
import Pagination from "../../ui/Pagination";

function RestaurantTable() {
  const { isLoading, menu, count } = useMenu();

  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns={"1.6fr 1fr 1fr 0fr"}>
        <Table.Header>
          <div>item</div>
          <div>price</div>
          <div>status</div>
        </Table.Header>
        <Table.Body
          data={menu}
          render={(item) => <RestaurantRow item={item} key={item.id} />}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default RestaurantTable;
