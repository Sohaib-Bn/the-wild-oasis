import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Empty from "../../ui/Empty";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./useDeleteBooking";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { isLoading, booking = {}, error } = useBooking();
  const { isLoading: isCheckingout, checkout } = useCheckout();
  const { isLoading: isDeleting, deleteBooking } = useDeleteBooking();

  const { status, id: bookingId } = booking;

  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  const navigate = useNavigate();

  if (isLoading || isCheckingout) return <Spinner />;
  if (!Object.keys(booking).length) return <Empty resource="Booking" />;
  if (error) {
    toast.error(error.message);
    return;
  }

  return (
    <>
      <Row $type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking.id}</Heading>
          <Tag $type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Modal>
          <Modal.Open opens="delete-booking">
            <Button $variation="danger">Delete booking #{bookingId}</Button>
          </Modal.Open>
          <Modal.Window name="delete-booking">
            <ConfirmDelete
              resource="Booking"
              disabled={isDeleting}
              onConfirm={() =>
                deleteBooking(bookingId, {
                  onSettled: moveBack,
                })
              }
            />
          </Modal.Window>
        </Modal>

        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/check-in/${booking.id}`)}>
            Check in booking #{bookingId}
          </Button>
        )}
        {status === "checked-in" && (
          <Button disabled={isCheckingout} onClick={() => checkout(bookingId)}>
            Check out booking #{bookingId}
          </Button>
        )}
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
