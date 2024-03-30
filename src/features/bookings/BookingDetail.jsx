import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import { useNavigate } from "react-router-dom";
import { useDeleteBooking } from "./useDeleteBooking";
import { useSettings } from "../settings/useSettings";
import { useBills } from "../restaurant/useBills";

import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import toast from "react-hot-toast";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { isLoading, booking = {}, error } = useBooking();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { isLoading: isLoading2, bills = [] } = useBills();

  const { isPending: isDeleting, deleteBooking } = useDeleteBooking();

  const { status, id: bookingId, numGuests, numNights } = booking;

  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  const navigate = useNavigate();

  if (isLoading || isLoadingSettings || isLoading2) return <Spinner />;
  if (!Object.keys(booking).length) return <Empty resource="Booking" />;
  if (error) {
    toast.error(error.message);
    return;
  }

  const breakfastPrice =
    Number(numNights) * Number(numGuests) * Number(settings?.breakfastPrice);

  return (
    <>
      <Row $type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking.id}</Heading>
          <Tag $type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox
        booking={booking}
        bills={bills}
        breakfastPrice={breakfastPrice}
      />
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
          <Button onClick={() => navigate(`/check-out/${bookingId}`)}>
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
