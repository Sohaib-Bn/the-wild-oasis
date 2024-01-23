import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import CreateBookingForm from "./CreateBookingForm";

function CreateBookin() {
  return (
    <Row>
      <Heading as="h1">Create new booking</Heading>
      <CreateBookingForm />
    </Row>
  );
}

export default CreateBookin;
