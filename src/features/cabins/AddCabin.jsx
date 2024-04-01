import { useDarkMode } from "../../contexts/DarkModeContex";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

import CreateUpdateCabinForm from "./CreateUpdateCabinFrom";

function AddCabin() {
  const { isRegularUser } = useDarkMode();

  return (
    <Modal>
      <Modal.Open opens="create-cabin">
        <Button disabled={isRegularUser} $align="start">
          Add new Cabin
        </Button>
      </Modal.Open>
      <Modal.Window name="create-cabin">
        <CreateUpdateCabinForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddCabin;
