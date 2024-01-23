import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";
import SpinnerMini from "../../ui/SpinnerMini";
import Select from "../../ui/Select";
import { useAllUsers } from "./useAllUsers";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullname: currentFullname, role: currRole },
    } = {},
  } = useUser();

  const { numAdminsUsers } = useAllUsers();
  const { isPending: isUpdating, updateUser } = useUpdateUser();

  const [fullname, setFullname] = useState(currentFullname);
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState(currRole);

  function handleSubmit(e) {
    e.preventDefault();

    if (!fullname) return;
    updateUser({ fullname, avatar, role });
  }

  function handleClear() {
    setFullname(currentFullname);
    setAvatar(null);
    setRole(currRole);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow
        warning={
          currRole === "admin" &&
          numAdminsUsers === 1 &&
          "Should be at least one admin account"
        }
        label="Role"
      >
        <Select
          disabled={currRole !== "admin" || numAdminsUsers === 1 || isUpdating}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            {
              label: "admin",
              value: "admin",
            },

            {
              label: "regular",
              value: "regular",
            },
          ]}
        />
      </FormRow>

      <FormRow label="Full name">
        <Input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          id="fullname"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow type="submit">
        <Button
          onClick={handleClear}
          disabled={isUpdating}
          type="reset"
          $variation="secondary"
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>
          {isUpdating ? <SpinnerMini /> : "Update account"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
