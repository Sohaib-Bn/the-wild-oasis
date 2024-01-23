import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

import CreateUpdateCabinForm from "./CreateUpdateCabinFrom";

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="create-cabin">
        <Button $align="start">Add new Cabin</Button>
      </Modal.Open>
      <Modal.Window name="create-cabin">
        <CreateUpdateCabinForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddCabin;
