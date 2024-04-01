import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Checkbox from "../../ui/Checkbox";
import Spinner from "../../ui/Spinner";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import { useSettings } from "../settings/useSettings";
import { formatCurrency } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { useCheckin } from "./useCheckin";
import { useDarkMode } from "../../contexts/DarkModeContex";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const { isLoading, booking = {} } = useBooking();
  const [isPaid, setIsPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  const moveBack = useMoveBack();

  useEffect(() => {
    if (booking?.isPaid) setIsPaid(true);
  }, [booking]);

  const { isPending: isUpdating, checkinBooking } = useCheckin();
  const { isLoading: isLoadingSettings, settings } = useSettings();

  const { isRegularUser } = useDarkMode();

  if (isLoading || isUpdating || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    hasBreakfast,
    numNights,
    numGuests,
  } = booking;

  const breakfastPrice =
    Number(numNights) * Number(numGuests) * Number(settings?.breakfastPrice);

  function handleCheckin() {
    if (isPaid) {
      if (!addBreakfast) checkinBooking({ bookingId, breafast: {} });
      else {
        checkinBooking({
          bookingId,
          breakfast: {
            totalPrice: totalPrice + breakfastPrice,
            hasBreakfast: true,
            extrasPrice: breakfastPrice,
          },
        });
      }
    }
  }

  return (
    <>
      <Row $type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} breakfastPrice={breakfastPrice} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            id="breakfast"
            onChange={() => {
              setAddBreakfast((add) => !add);
              setIsPaid(false);
            }}
          >
            Want to add breakfast for {formatCurrency(breakfastPrice)}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={isPaid}
          id={bookingId}
          onChange={() => setIsPaid(true)}
          disabled={isPaid}
        >
          I confirm that {guests.fullName} has paid the total amount{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + breakfastPrice
              )} ( ${formatCurrency(totalPrice)} + ${formatCurrency(
                breakfastPrice
              )} )`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          disabled={!isPaid || isUpdating || isRegularUser}
          onClick={handleCheckin}
        >
          Check in booking #{bookingId}
        </Button>

        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
