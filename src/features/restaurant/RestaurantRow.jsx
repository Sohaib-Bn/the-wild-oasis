import styled from "styled-components";
import Table from "../../ui/Table";
import Tag from "../../ui/Tag";
import { formatCurrency } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { useDeleteItem } from "./useDeleteItem";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import CreateUpdateItem from "./CreateUpdateItem";
import { useDarkMode } from "../../contexts/DarkModeContex";

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

function RestaurantRow({ item = {} }) {
  const { isDeleting, deleteItem } = useDeleteItem();
  const { isRegularUser } = useDarkMode();

  const statusToTagName = {
    available: "green",
    unavailable: "red",
  };

  return (
    <Modal>
      <Table.Row>
        <div>{item.name}</div>
        <Price>{formatCurrency(item.price)}</Price>
        <Tag $type={statusToTagName[item.status]}>{item.status}</Tag>

        <Menus.Menu>
          <Menus.Toggle id={item.id} />
          <Menus.List id={item.id}>
            <Modal.Open opens="update">
              <Menus.Button disabled={isRegularUser} icon={<HiPencil />}>
                Edit
              </Menus.Button>
            </Modal.Open>
            <Modal.Open opens="delete">
              <Menus.Button disabled={isRegularUser} icon={<HiTrash />}>
                Delete
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="delete">
          <ConfirmDelete
            onConfirm={() => deleteItem(item.id)}
            disabled={isDeleting}
            resource="item"
          />
        </Modal.Window>
        <Modal.Window name="update">
          <CreateUpdateItem itemToUpdate={item} />
        </Modal.Window>
      </Table.Row>
    </Modal>
  );
}

export default RestaurantRow;
