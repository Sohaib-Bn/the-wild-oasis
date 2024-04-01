import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import { Flag } from "../../ui/Flag";

import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";
import Row from "../../ui/Row";

const StyledBookingDataBox = styled.section`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

  background-color: ${(props) =>
    props.$isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${(props) =>
    props.$isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

const SpanLink = styled.footer`
  color: var(--color-brand-700);
  font-size: 1.35rem;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: var(--color-brand-900);
  }
`;

// A purely presentational component
function BookingDataBox({ booking, bills, breakfastPrice, checkoutSession }) {
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
    guests: { fullName: guestName, email, country, countryFlag, nationalID },
    cabins: { name: cabinName },
  } = booking;

  const hasExtrasPrice = Boolean(extrasPrice);

  const hasBills = Boolean(bills?.length);

  let totalBillsPriceNotPaid;
  let totalBillsPrice;

  if (status !== "unconfirmed") {
    totalBillsPriceNotPaid = bills
      ?.filter((bill) => !bill.isConfirmPayment)
      ?.map((bill) => bill.totalPrice)
      ?.reduce((cur, acc) => cur + acc, 0)
      ?.toFixed(2);

    totalBillsPrice = bills
      ?.map((bill) => bill.totalPrice)
      ?.reduce((cur, acc) => cur + acc, 0)
      ?.toFixed(2);
  }

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineHomeModern />
          <p>
            {numNights} nights in Cabin <span>{cabinName}</span>
          </p>
        </div>

        <p>
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>
      </Header>

      <Section>
        <Guest>
          {countryFlag && <Flag src={countryFlag} alt={`Flag of ${country}`} />}
          <p>
            {guestName} {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
          </p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <p>National ID {nationalID}</p>
        </Guest>

        {observations && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Observations"
          >
            {observations}
          </DataItem>
        )}

        <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
          {hasBreakfast ? "Yes" : "No"}
        </DataItem>

        {status !== "unconfirmed" && (
          <>
            <DataItem icon={<HiOutlineCheckCircle />} label="Bills registered?">
              {hasBills ? (
                <Row $gap={1.8}>
                  <span>
                    {bills?.length}
                    {` ( ${
                      bills?.filter((bill) => !bill.isConfirmPayment).length
                    } bill${
                      bills?.filter((bill) => !bill.isConfirmPayment).length !==
                      1
                        ? "s have"
                        : " has"
                    } not paid , ${
                      bills?.filter((bill) => bill.isConfirmPayment).length
                    } bill${
                      bills?.filter((bill) => bill.isConfirmPayment).length !==
                      1
                        ? "s have"
                        : " has"
                    } paid )`}
                  </span>
                  <SpanLink>Show details</SpanLink>
                </Row>
              ) : (
                "No"
              )}
            </DataItem>
          </>
        )}

        {hasExtrasPrice && (
          <>
            <DataItem icon={<HiOutlineCurrencyDollar />} label="Extras price :">
              <span>
                {`${formatCurrency(extrasPrice)} ( ${
                  hasBreakfast
                    ? `${formatCurrency(breakfastPrice)} breakfast `
                    : ""
                }${hasBreakfast && hasBills ? " + " : ""} ${
                  hasBills ? ` ${formatCurrency(totalBillsPrice)} bills` : ""
                } )
                `}
              </span>
            </DataItem>
          </>
        )}

        {checkoutSession && (
          <>
            <DataItem icon={<HiOutlineCurrencyDollar />} label="Total price :">
              {formatCurrency(totalPrice)}

              {hasExtrasPrice &&
                ` ( ${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
                  extrasPrice
                )} extras )`}
            </DataItem>
          </>
        )}

        {checkoutSession && Boolean(Number(totalBillsPriceNotPaid)) && (
          <Price $isPaid={!Boolean(Number(totalBillsPriceNotPaid))}>
            <DataItem
              icon={<HiOutlineCurrencyDollar />}
              label={"Bills not paid"}
            >
              {formatCurrency(totalBillsPriceNotPaid)}
            </DataItem>

            <p>
              {!Boolean(Number(totalBillsPriceNotPaid))
                ? "Paid"
                : "Will pay at property"}
            </p>
          </Price>
        )}

        {!checkoutSession && (
          <Price $isPaid={isPaid}>
            <DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
              {formatCurrency(totalPrice)}

              {hasExtrasPrice &&
                ` ( ${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
                  extrasPrice
                )} extras )`}
            </DataItem>

            <p>{isPaid ? "Paid" : "Will pay at property"}</p>
          </Price>
        )}
      </Section>

      <Footer>
        <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
