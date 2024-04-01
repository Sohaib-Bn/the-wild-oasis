import styled from "styled-components";

import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import { useSettings } from "../settings/useSettings";
import { formatCurrency, generateThankYouEmailHtml } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { useBills } from "../restaurant/useBills";
import { useCheckout } from "./useCheckout";
import { useSendEmail } from "./useSendEmail";
import { useUpdateBills } from "../restaurant/useUpdateBills";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckoutBooking() {
  const [isPaid, setIsPaid] = useState(false);
  const [sendEmailToGuest, setSendEmailToGuest] = useState(false);

  const { isLoading: isLoading1, booking = {} } = useBooking();
  const { isLoading: isLoading2, bills = [] } = useBills();
  const { isLoading: isLoadingSettings, settings } = useSettings();

  const { isUpdating: isUpdatingBills, updateBills } = useUpdateBills(false);
  const { isCheckingout, checkout } = useCheckout();
  const { isSendingEmail, sendEmail } = useSendEmail();

  const moveBack = useMoveBack();

  useEffect(() => {
    if (booking?.isPaid) setIsPaid(true);
  }, [booking]);

  if (
    isLoading1 ||
    isLoading2 ||
    isLoadingSettings ||
    isCheckingout ||
    isSendingEmail ||
    isUpdatingBills
  )
    return <Spinner />;

  const checkoutSession = Boolean(checkout);

  const { id: bookingId, guests, numNights, numGuests } = booking;

  const breakfastPrice =
    Number(numNights) * Number(numGuests) * Number(settings?.breakfastPrice);

  const totalBillsPriceNotPaid = bills
    .filter((bill) => !bill.isConfirmPayment)
    .map((bill) => bill.totalPrice)
    .reduce((cur, acc) => cur + acc, 0)
    ?.toFixed(2);

  function handleCheckout() {
    if (isPaid) {
      checkout(bookingId);
      updateBills({ bookingId, updatedData: { isConfirmPayment: true } });

      if (sendEmailToGuest) {
        const html = generateThankYouEmailHtml({
          bookingData: booking,
          bills,
        });
        sendEmail({ send_to: booking.guests.email, html });
      }
    }
  }

  return (
    <>
      <Row $type="horizontal">
        <Heading as="h1">Check out booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox
        bills={bills}
        booking={booking}
        breakfastPrice={breakfastPrice}
        checkoutSession={checkoutSession}
      />

      {Boolean(Number(totalBillsPriceNotPaid)) && (
        <Box>
          <Checkbox
            checked={isPaid}
            id={bookingId}
            onChange={() => setIsPaid(true)}
            disabled={isPaid}
          >
            I confirm that {guests.fullName} has paid the bills amount{" "}
            {`${formatCurrency(totalBillsPriceNotPaid)}`}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={sendEmailToGuest}
          id="sendEmail"
          onChange={() => setSendEmailToGuest((s) => !s)}
        >
          Send email to {booking.guests.email}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button disabled={!isPaid} onClick={handleCheckout}>
          Check out booking #{bookingId}
        </Button>

        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckoutBooking;
