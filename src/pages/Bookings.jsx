import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const navigate = useNavigate();
  return (
    <>
      <Row $type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>

      <Row>
        <BookingTable />
        <Button $align="start" onClick={() => navigate("/booking/new")}>
          Create new booking
        </Button>
      </Row>
    </>
  );
}

export default Bookings;
