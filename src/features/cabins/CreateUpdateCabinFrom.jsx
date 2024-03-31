import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Box from "../../ui/Box";
import Checkbox from "../../ui/Checkbox";

import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useUpdateCabin } from "./useUpdateCabin";
import { useState } from "react";
import Select from "../../ui/Select";

function CreateUpdateCabinForm({
  cabinToUpdate = {},
  onCloseModal,
  cabinBookings,
}) {
  const { id: updateId, status, ...updateValues } = cabinToUpdate;
  const [isOutOfService, setIsOutOfService] = useState(
    status === "unavailable"
  );

  const [type, setType] = useState("home");

  const isUpdateSession = Boolean(updateId);
  const isTypeModel = Boolean(onCloseModal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: isUpdateSession ? updateValues : {},
  });

  const { isCreating, createCabin } = useCreateCabin();

  const { isUpdating, updateCabin } = useUpdateCabin();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    data = {
      ...data,
      status: isOutOfService ? "unavailable" : "idel",
    };

    console.log(data.amentities);

    if (isUpdateSession)
      updateCabin(
        {
          newCabinData: {
            ...data,
            image,
            type,
            amentities:
              typeof data.amentities === "string"
                ? data.amentities.split(",")
                : [],
          },
          id: updateId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createCabin(
        {
          ...data,
          image,
          type,
          averageRate: 1,
          starRates: {
            1: 100,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
          isGuestsFavorite: false,
          amentities:
            typeof data.amentities === "string"
              ? data.amentities.split(",")
              : [],
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  return (
    <Form
      $type={isTypeModel ? "modal" : "regular"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          disabled={isWorking}
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "Max capacity is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "Regular price is required",
            validate: (value) =>
              value >= 0 || "Regular Price should be Positif",
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="discount"
          {...register("discount", {
            required: "Discount is required",
            validate: {
              isLessThenPric: (value, formValues) =>
                Number(value) <= Number(formValues.regularPrice) ||
                "Discount should be less then regular price",
              isPositif: (value) =>
                Number(value) >= 0 || "Discount should be positif",
            },
          })}
        />
      </FormRow>

      <FormRow label="Location" error={errors?.location?.message}>
        <Input
          placeholder="Algeria, Algiers"
          disabled={isWorking}
          id="location"
          {...register("location", {
            required: "Location is required",
          })}
        />
      </FormRow>

      <FormRow label="Amentities" error={errors?.amentities?.message}>
        <Input
          placeholder="wifi, conditioner"
          disabled={isWorking}
          id="amentities"
          {...register("amentities")}
        />
      </FormRow>

      <FormRow label="Type" error={errors?.type?.message}>
        <Select
          options={[
            { label: "Entire home", value: "home" },
            { label: "Room", value: "room" },
          ]}
          disabled={isWorking}
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </FormRow>

      <FormRow label="Descritpion" error={errors?.description?.message}>
        <Textarea
          disabled={isWorking}
          type="number"
          id="description"
          {...register("description")}
        />
      </FormRow>

      <FormRow label="Image" error={errors?.image?.message}>
        <FileInput
          disabled={isWorking}
          id="image"
          accept="image/*"
          {...register("image", {
            required: isUpdateSession ? false : "Image is required",
          })}
        />
      </FormRow>

      <FormRow
        warning={
          cabinBookings?.length
            ? `Can not set booked cabin out of service (Booking${
                cabinBookings.length !== 1 ? "s" : ""
              } ${cabinBookings.map((booking) => `#${booking.id}`).join(", ")})`
            : ""
        }
        orientation="vertical"
      >
        <Box>
          <Checkbox
            type="bold"
            disabled={
              isWorking ||
              cabinToUpdate.status === "active" ||
              cabinBookings?.length
            }
            id="isOutOfServie"
            checked={isOutOfService}
            onChange={() => setIsOutOfService((state) => !state)}
          >
            Is out of service (Under Maintenance)
          </Checkbox>
        </Box>
      </FormRow>

      <FormRow type="submit">
        <Button
          onClick={() => onCloseModal?.(false)}
          $variation="secondary"
          type="reset"
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isWorking
            ? "Waiting..."
            : isUpdateSession
            ? "Edit cabin"
            : "Create cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateCabinForm;
