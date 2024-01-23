import Heading from "../ui/Heading";
import SignupForm from "../features/authentication/SignupForm";
import Row from "../ui/Row";
import UsersTable from "../features/authentication/usersTable";
import Stacked from "../ui/Stacked";
import { useUser } from "../features/authentication/useUser";
import Warning from "../ui/Warning";

function NewUsers() {
  const {
    user: {
      user_metadata: { role },
    },
  } = useUser();

  return (
    <>
      <Row>
        <Stacked $type="horizontal">
          <Heading as="h1">Manage users </Heading>
          {role !== "admin" && (
            <Warning>Only admins can create or update users</Warning>
          )}
        </Stacked>
        <UsersTable />
      </Row>

      <Row>
        <Heading as="h1">Create a new user</Heading>
        <SignupForm />
      </Row>
    </>
  );
}

export default NewUsers;
