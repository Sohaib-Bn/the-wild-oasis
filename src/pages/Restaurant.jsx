import RestaurantTable from "../features/restaurant/RestaurantTable";
import Row from "../ui/Row";
import Heading from "../ui/Heading";
import RestaurantOperations from "../features/restaurant/RestaurantOperations";
import RegisterBillForm from "../features/restaurant/RegisterBillForm";

function Restaurant() {
  return (
    <>
      <Row>
        <Row $type="horizontal">
          <Heading as="h1">Restaurant menu</Heading>
          <RestaurantOperations />
        </Row>
        <RestaurantTable />
      </Row>
      <Row>
        <Heading as="h1">Register a bill</Heading>
        <RegisterBillForm />
      </Row>
    </>
  );
}

export default Restaurant;
