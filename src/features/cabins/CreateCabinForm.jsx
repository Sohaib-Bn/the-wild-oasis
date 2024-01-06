import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useUpdateCabin } from "./useUpdateCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: updateId, ...updateValues } = cabinToEdit;

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

    if (isUpdateSession)
      updateCabin(
        { newCabinData: { ...data, image }, id: updateId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  return (
    <Form
      type={isTypeModel ? "modal" : "regular"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormRow label="Cabin name" error={errors.name?.message}>
        <Input
          disabled={isWorking}
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors.maxCapacity?.message}>
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

      <FormRow label="Regular price" error={errors.regularPrice?.message}>
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

      <FormRow label="Discount" error={errors.discount?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="discount"
          defaultValue={0}
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

      <FormRow label="Descritpion" error={errors.description?.message}>
        <Textarea
          type="number"
          id="description"
          {...register("description", { required: "Description is required" })}
        />
      </FormRow>

      <FormRow label="Image" error={errors.image?.message}>
        <FileInput
          disabled={isWorking}
          id="image"
          accept="image/*"
          {...register("image", {
            required: isUpdateSession ? false : "Image is required",
          })}
        />
      </FormRow>

      <FormRow>
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

export default CreateCabinForm;
