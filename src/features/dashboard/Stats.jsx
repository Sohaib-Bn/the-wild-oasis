import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({
  bookingsAfterDate,
  confirmedStaysAfterDate,
  lastDays,
  cabins,
}) {
  // 1. BOOKINGS NUMBERS
  const bookingsLength = bookingsAfterDate?.length;

  // 2. SALES
  const sales = bookingsAfterDate
    ?.filter((b) => b.status !== "unconfirmed")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  // 3. CHCKED IN
  const stays = confirmedStaysAfterDate?.length;

  // 4. OCCUPATION
  // NUM OF CHECKED NIGHTS / ALL AVAILABLES NIGHTS
  const checkedinNightsNum = confirmedStaysAfterDate?.reduce(
    (acc, curr) => acc + curr.numNights,
    0
  );

  const availableNights = lastDays * cabins?.length;

  const occupation = checkedinNightsNum / availableNights;

  return (
    <>
      <Stat
        value={bookingsLength}
        title="Bookings"
        icon={<HiOutlineBriefcase />}
        color="blue"
      />
      <Stat
        value={formatCurrency(sales)}
        title="Sales"
        icon={<HiOutlineBanknotes />}
        color="green"
      />
      <Stat
        value={stays}
        title="Stays"
        icon={<HiOutlineCalendarDays />}
        color="indigo"
      />
      <Stat
        value={Math.round(occupation * 100) + " %"}
        title="Occupansy rate"
        icon={<HiOutlineChartBar />}
        color="yellow"
      />
    </>
  );
}

export default Stats;
