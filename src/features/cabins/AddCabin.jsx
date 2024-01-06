import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="create-cabin">
        <div>
          <Button>Add new Cabin</Button>
        </div>
      </Modal.Open>
      <Modal.Window name="create-cabin">
        <CreateCabinForm />
      </Modal.Window>
    </Modal>
  );
}

// function AddCabin() {
//   const [isShowModal, setIsShowModal] = useState(false);

//   return (
//     <div>
//       <Button onClick={() => setIsShowModal(true)}>Add cabin</Button>
//       {isShowModal && (
//         <Modal onCloseModal={setIsShowModal}>
//           <CreateCabinForm onCloseModal={setIsShowModal} />
//         </Modal>
//       )}
//     </div>
//   );
// }

export default AddCabin;
