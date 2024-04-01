import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Box from "../../ui/Box";
import CheckBox from "../../ui/Checkbox";
import DynamicInputsComponent from "../../ui/DynamicInputsComponent";
import Select from "../../ui/Select";
import Spinner from "../../ui/Spinner";
import SpinnerMini from "../../ui/SpinnerMini";

import { useMenu } from "./useMenu";
import { useForm } from "react-hook-form";
import { useBookings } from "../bookings/useBookings";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { useCreateBill } from "./useCreateBill";
import { useUpdateBooking } from "../bookings/useUpdateBooking";
import { useDarkMode } from "../../contexts/DarkModeContex";

function RegisterBillForm({ onCloseModal }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmPayment, setIsConfirmPayment] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [cabinName, setCabinName] = useState("");
  const [itemsError, setItemsError] = useState(false);
  const [initializeInputContainers, setInitializeInputContainers] =
    useState(false);

  const { isLoading: isLoading1, menu } = useMenu(true);
  const { isLoading: isLoading2, bookings } = useBookings(true);
  const { isCreating, createBill } = useCreateBill();
  const { isUpdating, updateBooking } = useUpdateBooking(false);

  const { isRegularUser } = useDarkMode();

  const {
    handleSubmit,
    unregister,
    register,
    setValue,
    setError,
    getValues,
    clearErrors,
    watch,
    getFieldState,
    formState: { errors },
  } = useForm();

  const bookingId = watch("bookingId");

  const formData = getValues();

  const [dynamicInputKeys, setDynamicInputKeys] = useState([
    "0-name",
    "0-price",
    "0-quantity",
  ]);

  const dynamicInputsWatched = watch(dynamicInputKeys);

  useEffect(() => {
    // Function to calculate total price
    const calculateTotalPrice = () => {
      let totalPrice = 0;

      for (const key in formData) {
        if (key.endsWith("-name")) {
          const index = key.split("-")[0];
          const itemName = formData[`${index}-name`];
          const itemPrice = parseFloat(
            formData[`${index}-price`]?.split("$")[1]
          );
          const itemQuantity = parseInt(formData[`${index}-quantity`]);

          const currPrice =
            menu?.find((item) => item.id === +itemName?.split("-")[1])?.price ??
            0;

          if (
            itemPrice !== currPrice &&
            getFieldState(`${index}-name`).isDirty
          ) {
            setValue(`${index}-price`, formatCurrency(currPrice));
          }

          if (itemName && !isNaN(itemPrice)) {
            totalPrice += itemPrice * itemQuantity;
          }
        }
      }

      setTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [formData, dynamicInputsWatched, getFieldState, menu, setValue]);

  const isWorking = isLoading1 || isLoading2;

  if (isWorking) return <Spinner />;

  const options =
    menu
      ?.filter((item) => item.status === "available")
      ?.map((item) => {
        return {
          label: item.name,
          value: `${item.name}-${item.id}`,
        };
      }) ?? [];

  const handleBlur = function () {
    const {
      cabins: { name: cabinName } = {},
      guests: { fullName: guestName } = {},
    } =
      bookings.find(
        (booking) =>
          booking.status === "checked-in" && booking.id === +bookingId
      ) ?? {};

    setGuestName(guestName);
    setCabinName(cabinName);

    if (!cabinName || !guestName) {
      setError("bookingId", {
        type: "custom",
        message: "No checked-in booking found",
      });
      setGuestName("");
      setCabinName("");
    } else clearErrors("bookingId");
  };

  function onSubmit(formData) {
    let items = [];
    for (const key in formData) {
      if (key.endsWith("-name")) {
        const index = key.split("-")[0];
        const id = formData[`${index}-name`]?.split("-")[1];
        const name = formData[`${index}-name`]?.split("-")[0];
        const price = formData[`${index}-price`]?.split("$")[1];
        const quantity = formData[`${index}-quantity`];

        if (id && name && price && quantity)
          items.push({
            id,
            name,
            price,
            quantity,
          });
      }
    }

    if (!items.length) {
      setItemsError(true);
      return;
    } else setItemsError(false);

    const itemsJSONString = JSON.stringify(items);

    const billData = {
      bookingId: +formData.bookingId,
      observation: formData.observation,
      totalPrice: totalPrice,
      isConfirmPayment: isConfirmPayment,
      items: itemsJSONString,
    };

    const currBooking = bookings.find(
      (booking) =>
        booking.status === "checked-in" && booking.id === +formData.bookingId
    );

    createBill(billData, {
      onSettled: () => {
        handleClear();
      },
    });

    updateBooking({
      id: +formData.bookingId,
      bookingObj: {
        totalPrice: currBooking.totalPrice + totalPrice,
        extrasPrice: currBooking.extrasPrice + totalPrice,
        isPaid: !currBooking.isPaid ? currBooking.isPaid : isConfirmPayment,
      },
    });
  }

  function handleClear() {
    for (const key in formData) {
      if (key.endsWith("-name")) {
        const index = key.split("-")[0];
        setValue(`${index}-name`, "");
        setValue(`${index}-price`, formatCurrency(0));
        setValue(`${index}-quantity`, 1);
      }
    }

    setValue("bookingId", "");
    setValue("observation", "");
    setGuestName("");
    setCabinName("");
    setIsConfirmPayment(false);
    setInitializeInputContainers(true);
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        $type={onCloseModal ? "modal" : "regular"}
      >
        <FormRow label="Booking id" error={errors?.bookingId?.message}>
          <Input
            disabled={isCreating || isUpdating}
            id="bookingId"
            {...register("bookingId", {
              required: "This field is required",
              validate: () =>
                bookings.find(
                  (booking) =>
                    booking.status === "checked-in" && booking.id === +bookingId
                ) || "No checked-in booking found",
            })}
            onBlur={handleBlur}
          />
        </FormRow>
        <FormRow label="Guest name">
          <Input disabled value={guestName} />
        </FormRow>
        <FormRow label="Cabin name">
          <Input disabled value={cabinName} />
        </FormRow>
        <FormRow
          warning={itemsError ? "Should be at least one item ordered" : ""}
          warningType={"red"}
          type="dynamicInputs"
          label="Items ordered"
        >
          <DynamicInputsComponent
            setInitializeInputContainers={setInitializeInputContainers}
            initializeInputContainers={initializeInputContainers}
            onSetDynamicInputKeys={setDynamicInputKeys}
            unregister={unregister}
            register={register}
            colums=" 23rem 10rem 8rem"
            inputs={[
              <Select
                disabled={isCreating || isUpdating}
                defaultValue=""
                name="name"
                options={[
                  { default: true, label: "Name", value: "" },
                  ...options,
                ]}
              />,
              <Input disabled name="price" placeholder="price" />,
              <Input
                // disabled={isCreating || isUpdating}
                min={1}
                defaultValue={1}
                type="number"
                name="quantity"
              />,
            ]}
          />
        </FormRow>
        <FormRow label="Observation">
          <Textarea id="observation" {...register("observation")} />
        </FormRow>
        <FormRow label="Total price">
          <Input disabled value={formatCurrency(totalPrice)} />
        </FormRow>
        <Box>
          <CheckBox
            disabled={isCreating || isUpdating}
            checked={isConfirmPayment}
            onChange={() => setIsConfirmPayment((state) => !state)}
            id="confirmPayment"
            type="bold"
          >
            {" "}
            Confirm payment{" "}
            {Boolean(totalPrice) && `(${formatCurrency(totalPrice)})`}
          </CheckBox>
        </Box>

        <FormRow type="submit">
          <Button
            onClick={handleClear}
            disabled={isCreating || isUpdating}
            $variation="secondary"
            type="reset"
          >
            Cancel
          </Button>
          <Button disabled={isCreating || isUpdating || isRegularUser}>
            {isCreating || isUpdating ? <SpinnerMini /> : "Register new bill"}
          </Button>
        </FormRow>
      </Form>
    </>
  );
}

export default RegisterBillForm;
