import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import { useForm } from "react-hook-form";
import { useCreateItem } from "./useCreateItem";
import { useUpdateItem } from "./useUpdateItem";

function CreateUpdateItem({ itemToUpdate = {}, onCloseModal }) {
  const { id } = itemToUpdate;

  const isUpdateSession = Boolean(id);

  const { isCreating, createItem } = useCreateItem();
  const { isUpdating, updateItem } = useUpdateItem();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: isUpdateSession ? itemToUpdate : {} });

  const isWorking = isCreating || isUpdating;

  const onSubmit = function (formData) {
    const data = {
      ...formData,
      name:
        formData.name.toLowerCase().charAt(0).toUpperCase() +
        formData.name.toLowerCase().slice(1),
    };
    if (isUpdateSession) {
      updateItem(
        { id, newItemObj: data },
        {
          onSettled: () => {
            onCloseModal?.();
            reset();
          },
        }
      );
    } else {
      createItem(data, {
        onSettled: () => {
          onCloseModal?.();
          reset();
        },
      });
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      $type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Name" error={errors?.name?.message}>
        <Input
          {...register("name", { required: "This feild is required" })}
          disabled={isWorking}
        />
      </FormRow>
      <FormRow label="Price" error={errors?.price?.message}>
        <Input
          disabled={isWorking}
          {...register("price", {
            required: "This feild is required",
            min: {
              value: 0,
              message: "Price should be positive",
            },
            pattern: {
              value: /^\d*\.?\d*$/,
              message: "Invalid price format",
            },
          })}
        />
      </FormRow>
      <FormRow label="Status">
        <Select
          disabled={isWorking}
          register={{ ...register("status") }}
          options={[
            {
              label: "available",
              value: "available",
            },
            {
              label: "unavailable",
              value: "unavailable",
            },
          ]}
        />
      </FormRow>
      <FormRow type="submit">
        <Button disabled={isWorking} $variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isUpdateSession ? "Edit item" : "Add new item"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateItem;
