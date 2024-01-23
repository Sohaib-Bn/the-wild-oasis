import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup";
import SpinnerMini from "../../ui/SpinnerMini";
import Select from "../../ui/Select";
import { useState } from "react";
import { useUser } from "./useUser";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const [role, setRole] = useState("regular");
  const { isPending, signup } = useSignup();
  const { user } = useUser();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const onSubmit = function ({ email, password, fullname }) {
  //   signup({ email, password, fullname }, { onSettled: () => reset() });
  // };

  const onSubmit = function (formData) {
    const data = {
      ...formData,
      role: role,
      created_with: user,
    };

    signup(data, {
      onSettled: () => {
        reset();
        setRole("");
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullname?.message}>
        <Input
          disabled={user.user_metadata.role !== "admin" || isPending}
          type="text"
          id="fullName"
          {...register("fullname", { required: "field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          disabled={user.user_metadata.role !== "admin" || isPending}
          type="email"
          id="email"
          {...register("email", {
            required: "field is required",
            pattern: {
              message: "Email invalid",
              value: /\S+@\S+\.\S+/,
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          disabled={user.user_metadata.role !== "admin" || isPending}
          type="password"
          id="password"
          {...register("password", {
            required: "field is required",
            minLength: {
              message: "password should be at least 8 characters",
              value: 8,
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          disabled={user.user_metadata.role !== "admin" || isPending}
          type="password"
          id="passwordConfirm"
          {...register("passwordConfirm", {
            required: "field is required",
            validate: (value, formValues) =>
              value === formValues.password || "Password not matched",
          })}
        />
      </FormRow>

      <FormRow label="Role" error="">
        <Select
          disabled={user.user_metadata.role !== "admin" || isPending}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            {
              label: "regular",
              value: "regular",
            },
            {
              label: "admin",
              value: "admin",
            },
          ]}
        />
      </FormRow>

      <FormRow type="submit">
        {/* type is an HTML attribute! */}
        <Button
          onClick={reset}
          disabled={isPending || user.user_metadata.role !== "admin"}
          $variation="secondary"
          type="reset"
        >
          Cancel
        </Button>
        <Button disabled={isPending || user.user_metadata.role !== "admin"}>
          {isPending ? <SpinnerMini /> : "Create new user"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
