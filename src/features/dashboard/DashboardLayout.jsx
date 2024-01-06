import styled from "styled-components";
import Stats from "./Stats";
import { useBookingsAfterDate } from "./useBookingsAfterDate";
import { useStaysAfterDate } from "./useStaysAfterDate";
import { useCabins } from "../cabins/useCabins";
import Spinner from "../../ui/Spinner";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isLoading: isLoading1, bookingsAfterDate } = useBookingsAfterDate();
  const {
    isLoading: isLoading2,
    confirmedStaysAfterDate,
    lastDays,
  } = useStaysAfterDate();
  const { cabins, isLoading: isLoading3 } = useCabins();

  if (isLoading1 || isLoading2 || isLoading3) return <Spinner />;
  return (
    <StyledDashboardLayout>
      <Stats
        bookingsAfterDate={bookingsAfterDate}
        confirmedStaysAfterDate={confirmedStaysAfterDate}
        lastDays={lastDays}
        cabins={cabins}
      />
      <TodayActivity />
      <DurationChart confirmedStaysAfterDate={confirmedStaysAfterDate} />
      <SalesChart bookings={bookingsAfterDate} numDays={lastDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
