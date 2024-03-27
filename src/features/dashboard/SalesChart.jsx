import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../contexts/DarkModeContex";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { getToday } from "../../utils/helpers";
const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;
  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ bookings, numDays }) {
  const allDays = eachDayOfInterval({
    start: subDays(new Date(), numDays),
    end: getToday(),
  });

  const data = allDays.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings
        .filter(
          (b) => isSameDay(date, b.created_at) && b.status !== "unconfirmed"
        )
        .reduce((acc, cur) => acc + cur.totalPrice, 0),
      extrasSales: bookings
        .filter(
          (b) => isSameDay(date, b.created_at) && b.status !== "unconfirmed"
        )
        .reduce((acc, cur) => acc + cur.extrasPrice, 0),
    };
  });

  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };
  return (
    <StyledSalesChart>
      <Heading as="h3">
        Sales from {format(allDays.at(0), "MMM dd yyyy")} to{" "}
        {format(allDays.at(-1), "MMM dd yyyy")}
      </Heading>
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ background: colors.background }} />
          <Area
            type="monotone"
            dataKey={"totalSales"}
            stroke={colors.totalSales.stroke}
            strokeWidth={2}
            fill={colors.totalSales.fill}
            unit="$"
            name="Total sales"
          />
          <Area
            type="monotone"
            dataKey={"extrasSales"}
            stroke={colors.extrasSales.stroke}
            strokeWidth={2}
            fill={colors.extrasSales.fill}
            unit="$"
            name="Extras sales"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
