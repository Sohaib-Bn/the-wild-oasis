import { format } from "date-fns";
import Table from "../../ui/Table";
import styled from "styled-components";
import { useUser } from "./useUser";
import Tag from "../../ui/Tag";
import Menus from "../../ui/Menus";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteUser } from "./useDeleteUser";
import UpdateUserForm from "./UpdateUserForm";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

function UserRow({ user }) {
  const { isPending: isDeleting, deleteUser } = useDeleteUser();

  const {
    user: {
      id: currId,
      user_metadata: { role: currUserRole },
    },
  } = useUser();

  const {
    id: userId,
    created_at,
    email,
    user_metadata: {
      fullname,
      role,
      created_with: {
        id: created_withId,
        user_metadata: { fullname: created_withFullname },
      },
    },
  } = user;

  const roleToTagName = {
    admin: "green",
    regular: "blue",
  };

  return (
    <Table.Row>
      <Modal>
        <Stacked>
          <span>{format(created_at, "MMM dd yyyy p")}</span>
          <span>
            By {created_withId === currId ? "you" : created_withFullname}
          </span>
        </Stacked>
        <div>{fullname}</div>
        <div>{email}</div>
        <Tag $type={roleToTagName[role]}>{role}</Tag>
        <Menus.Menu>
          <Menus.Toggle id={user.id} />
          <Menus.List id={user.id}>
            <Modal.Open opens="update-user">
              <Menus.Button
                disabled={currUserRole !== "admin"}
                icon={<HiPencil />}
              >
                edit
              </Menus.Button>
            </Modal.Open>
            {currId !== userId && (
              <Modal.Open opens="delete-user">
                <Menus.Button
                  disabled={currUserRole !== "admin"}
                  icon={<HiTrash />}
                >
                  delete
                </Menus.Button>
              </Modal.Open>
            )}
          </Menus.List>
        </Menus.Menu>
        <Modal.Window name="delete-user">
          <ConfirmDelete
            resource="user"
            onConfirm={() => deleteUser(user.id)}
            disabled={isDeleting}
          />
        </Modal.Window>
        <Modal.Window name="update-user">
          <UpdateUserForm userData={{ fullname, email, role, userId }} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default UserRow;
