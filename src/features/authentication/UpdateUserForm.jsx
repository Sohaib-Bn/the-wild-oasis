import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import SpinnerMini from "../../ui/SpinnerMini";
import Select from "../../ui/Select";
import Button from "../../ui/Button";

import { useState } from "react";
import { useUpdateUserById } from "./useUpdateUserById";
import { useAllUsers } from "./useAllUsers";

function UpdateUserForm({ userData, onCloseModal }) {
  const { fullname, email, role: userRole, userId } = userData;
  const [role, setRole] = useState(userRole);

  const { isPending: isUpdating, updateUserById } = useUpdateUserById();
  const { numAdminsUsers } = useAllUsers();

  function handleSubmit(e) {
    e.preventDefault();
    if (!role) return;

    updateUserById(
      { id: userId, data: { role } },
      { onSettled: () => onCloseModal() }
    );
  }

  return (
    <Form $type="modal-mini" onSubmit={handleSubmit}>
      <FormRow label="Full name">
        <Input value={fullname} disabled />
      </FormRow>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow
        warning={
          userRole === "admin" &&
          numAdminsUsers === 1 &&
          "Should be at least one admin account"
        }
        label="Role"
      >
        <Select
          disabled={
            (userRole === "admin" && numAdminsUsers === 1) || isUpdating
          }
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

      <FormRow type="submit">
        <Button
          disabled={
            isUpdating || (userRole === "admin" && numAdminsUsers === 1)
          }
        >
          {isUpdating ? <SpinnerMini /> : "Update user"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserForm;
