import Modal from "../../ui/Modal";
import OperationButton from "../../ui/OpearationButton";
import CreateUpdateItem from "./CreateUpdateItem";

function CreateItemModal() {
  return (
    <Modal>
      <Modal.Open opens="create-item">
        <OperationButton>Add new item </OperationButton>
      </Modal.Open>
      <Modal.Window name="create-item">
        <CreateUpdateItem type="modal" />
      </Modal.Window>
    </Modal>
  );
}

export default CreateItemModal;
