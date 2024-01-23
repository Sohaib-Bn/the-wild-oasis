// import Checkbox from "../../ui/Checkbox";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import InputDatePicker from "../../ui/InputDatePicker";
import Heading from "../../ui/Heading";
import Select from "../../ui/Select";
import Spinner from "../../ui/Spinner";
import SpinnerMini from "../../ui/SpinnerMini";
import Box from "../../ui/Box";
import Warning from "../../ui/Warning";
import Checkbox from "../../ui/Checkbox";

import { useCabins } from "../cabins/useCabins";
import { formatCurrency } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { useSettings } from "../settings/useSettings";
import { useForm } from "react-hook-form";
import { addDays, isAfter, isBefore, isWithinInterval } from "date-fns";
import { useCreateBooking } from "./useCreateBooking";
import { useNavigate } from "react-router-dom";
import { useBookings } from "./useBookings";

function CreateBookingForm() {
  const [selectedCabinId, setSelectedCabinId] = useState("");
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [overlappingBookings, setOverLappingBookings] = useState(null);
  const [isOverlappingIgnored, setIsOverlappingIgnored] = useState(false);

  const hasExtrasprice = hasBreakfast;

  const { isLoading: isLoading1, settings } = useSettings();
  const { isLoading: isLoading2, cabins } = useCabins();
  const { isLoading: isLoading3, bookings } = useBookings(true);
  const { isCreating, createBooking } = useCreateBooking();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      numGuests: "1",
    },
  });

  useEffect(() => {
    if (selectedCabinId) clearErrors("numGuests");
  }, [selectedCabinId, clearErrors]);

  if (isLoading1 || isLoading2 || isLoading3) return <Spinner />;

  const cabinsOptions = cabins
    .filter((cabin) => cabin.status !== "unavailable")
    .map((cabin) => {
      return {
        label: `${cabin.name} (${formatCurrency(cabin.regularPrice)} ${
          cabin.discount
            ? `&mdash; ${formatCurrency(cabin.discount)} discount`
            : ""
        }) `,
        value: cabin.id,
      };
    })
    .sort((a, b) => a.label.split(" ").at(0) - b.label.split(" ").at(0));

  const selectedCabin = cabins
    ?.filter(
      (cabin) =>
        cabin.id === (Number(selectedCabinId) || cabinsOptions.at(0).value)
    )
    .at(0);

  const {
    minBookingLength,
    maxBookingLength,
    breakfastPrice: breakfastPriceSetting,
  } = settings;

  const numNights = watch("numNights", minBookingLength);
  const numGuests = watch("numGuests");
  const endDate = addDays(startDate, Number(numNights));

  const breakfastPrice = numNights * numGuests * Number(breakfastPriceSetting);

  const extrasPrice = breakfastPrice;

  const totalRegularPrice =
    (selectedCabin.regularPrice - selectedCabin.discount) * numNights;

  const totalPrice = hasBreakfast
    ? totalRegularPrice + extrasPrice
    : totalRegularPrice;

  const isDateRangeOverlap = (start1, end1, start2, end2) => {
    return (
      (isBefore(start1, end2) && isAfter(end1, start2)) ||
      isWithinInterval(start1, { start: start2, end: end2 }) ||
      isWithinInterval(end1, { start: start2, end: end2 })
    );
  };

  const onSubmit = function (formData) {
    if (!isOverlappingIgnored) {
      const overlappingBookings = bookings.filter(
        (booking) =>
          booking.cabinId === +selectedCabin.id &&
          booking.status === "unconfirmed" &&
          isDateRangeOverlap(
            booking.startDate,
            booking.endDate,
            startDate,
            endDate
          )
      );

      if (overlappingBookings.length) {
        setOverLappingBookings(overlappingBookings);
        return;
      } else setOverLappingBookings(null);
    }

    const bookingData = {
      ...formData,
      nationalID: formData.nationalId,
      startDate: startDate.setUTCHours(0, 0, 0, 0),
      endDate: endDate.setUTCHours(0, 0, 0, 0),
      cabinPrice: selectedCabin.regularPrice,
      cabinId: selectedCabin.id,
      totalPrice: totalPrice,
      extrasPrice: extrasPrice,
      status: "unconfirmed",
      isPaid: false,
      hasBreakfast: hasBreakfast,
    };

    createBooking(bookingData, {
      onSuccess: (data) => navigate(`/check-in/${data.id}`),
      onSettled: () => {
        reset();
        setSelectedCabinId("");
        setStartDate(new Date());
        setHasBreakfast(false);
        setIsOverlappingIgnored(false);
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Heading as="h2">About guest</Heading>
      </Box>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          disabled={isCreating}
          id="fullName"
          {...register("fullName", { required: "Field required" })}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          disabled={isCreating}
          id="email"
          {...register("email", {
            required: "Field required",
            pattern: {
              message: "Email invalid",
              value: /\S+@\S+\.\S+/,
            },
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Input
          disabled={isCreating}
          id="nationality"
          {...register("nationality", { required: "Field required" })}
        />
      </FormRow>

      <FormRow label="National id" error={errors?.nationalId?.message}>
        <Input
          disabled={isCreating}
          id="nationalId"
          {...register("nationalId", { required: "Field required" })}
        />
      </FormRow>
      <Box>
        <Heading as="h2">About booking</Heading>
      </Box>
      <FormRow
        warning={
          errors?.numNights &&
          `Minmum nights should be at least ${minBookingLength} and the maximum should be less ${maxBookingLength}`
        }
        label="Number of nights"
        error={errors?.numNights?.message}
      >
        <Input
          disabled={isCreating}
          min={minBookingLength}
          max={maxBookingLength}
          type="number"
          id="numNights"
          defaultValue={numNights}
          // onChange={(e) => setNumNights(Number(e.target.value))}?
          {...register("numNights", {
            required: "Field required",
            min: {
              value: minBookingLength,
              message: `Nights should be at least ${minBookingLength}`,
            },
            max: {
              value: maxBookingLength,
              message: `Maximum nights is ${maxBookingLength}`,
            },
          })}
        />
      </FormRow>
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <InputDatePicker
          disabled={isCreating}
          handleChange={(date) => setStartDate(date)}
          value={startDate}
          id="startDate"
        />
      </FormRow>
      <FormRow label="End date" error={errors?.endDate?.message}>
        <InputDatePicker value={endDate} id="endDate" disabled />
      </FormRow>
      <FormRow
        warning={
          errors?.numGuests &&
          `Maximum guests in cabin ${selectedCabin.name} is ${selectedCabin.maxCapacity}`
        }
        label="Number of guests"
        error={errors?.numGuests?.message}
      >
        <Input
          disabled={isCreating}
          min={1}
          type="number"
          id="numGuests"
          {...register("numGuests", {
            required: "Field required",
            min: {
              value: 1,
              message: "Guests should be at least 1",
            },
            max: {
              value: selectedCabin.maxCapacity,
              message: `Maximum guests is ${selectedCabin.maxCapacity}`,
            },
          })}
        />
      </FormRow>

      <FormRow label="Cabin name" error={errors?.cabinName?.message}>
        <Select
          id="cabinName"
          disabled={isCreating}
          value={selectedCabinId}
          onChange={(e) => setSelectedCabinId(e.target.value)}
          options={cabinsOptions}
        />
      </FormRow>
      <FormRow label="Observations">
        <Textarea
          disabled={isCreating}
          id="observations"
          {...register("observations")}
        />
      </FormRow>
      <FormRow label="Total price">
        <Input
          disabled
          id="totalPrice"
          value={`${formatCurrency(totalPrice)} ${
            hasExtrasprice
              ? `(${formatCurrency(totalRegularPrice)} + ${formatCurrency(
                  extrasPrice
                )})`
              : ""
          }`}
        />
      </FormRow>
      <Box>
        <Checkbox
          disabled={!numGuests || !numNights || isCreating}
          checked={hasBreakfast}
          onChange={() => setHasBreakfast((has) => !has)}
          type="bold"
        >
          Add breakfast{" "}
          {breakfastPrice ? `(${formatCurrency(breakfastPrice)})` : ""}
        </Checkbox>
      </Box>
      {!isOverlappingIgnored && Boolean(overlappingBookings?.length) && (
        <Warning
          buttonContent={`
          ${!isOverlappingIgnored && "Ignore"}
          `}
          type="red"
          handleClick={(e) => {
            e.preventDefault();
            setIsOverlappingIgnored(true);
          }}
        >
          {`Booking${
            overlappingBookings.length !== 1 ? "s" : ""
          } ${overlappingBookings
            .map((booking) => `#${booking.id}`)
            .join(", ")} match this date range`}
        </Warning>
      )}
      <FormRow type="submit">
        <Button disabled={isCreating} $variation="secondary" type="reset">
          Cancel
        </Button>

        <Button disabled={isCreating}>
          {isCreating ? <SpinnerMini /> : "Create new booking"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
