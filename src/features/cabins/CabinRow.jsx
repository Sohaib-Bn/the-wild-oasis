import { formatCurrency } from "../../utils/helpers";
import { useDeleteCabin } from "./useDeleteCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "./useCreateCabin";
import { addDays, isWithinInterval } from "date-fns";
import { useEffect } from "react";
import { useUpdateCabin } from "./useUpdateCabin";

import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Tag from "../../ui/Tag";
import CreateUpdateCabinForm from "./CreateUpdateCabinFrom";

import styled from "styled-components";
import { useDarkMode } from "../../contexts/DarkModeContex";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-green-700);
`;

function CabinRow({ cabin, bookings }) {
  const {
    id: cabinId,
    image,
    name,
    maxCapacity,
    regularPrice,
    discount,
    description,
    status,
  } = cabin;

  const { isCreating, createCabin } = useCreateCabin();
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { isRegularUser } = useDarkMode();

  // THE FIRST ARGUEMNT REFERS IF DISPLAY TOASTS OR NOT
  const { updateCabin } = useUpdateCabin(false);

  useEffect(() => {
    if (status === "unavailable");

    const activeBooking = bookings.find((booking) => {
      return (
        booking.cabinId === cabinId &&
        booking.status === "checked-in" &&
        isWithinInterval(new Date(), {
          start: booking.startDate,
          end: addDays(booking.endDate, 2),
        })
      );
    });

    const newCabinData = activeBooking ? "active" : "idel";

    if (status !== newCabinData) {
      updateCabin({
        id: cabinId,
        newCabinData: { ...cabin, status: newCabinData },
      });
    }
  }, [cabinId, updateCabin, bookings, cabin, status]);

  if (isCreating || isDeleting) return <Spinner />;

  const cabinBookings = bookings.filter(
    (booking) => booking.cabinId === cabinId && booking.status === "unconfirmed"
  );

  function handleDuplicate() {
    const dublicatedCabin = {
      name: `Copy of ${name}`,
      image,
      maxCapacity,
      regularPrice,
      discount,
      description,
      status: "idel",
    };

    createCabin(dublicatedCabin);
  }

  const statusToTagName = {
    active: "green",
    idel: "silver",
    unavailable: "red",
  };

  return (
    <Table.Row>
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}

      <Tag $type={statusToTagName[status]}>{status}</Tag>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId} />

            <Menus.List id={cabinId}>
              <Menus.Button
                disabled={isRegularUser}
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
              >
                Duplicate
              </Menus.Button>

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

            <Modal.Window name="update">
              <CreateUpdateCabinForm
                cabinToUpdate={cabin}
                cabinBookings={cabinBookings}
              />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cabins"
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
