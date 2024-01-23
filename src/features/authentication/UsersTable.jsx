import { useAllUsers } from "../../features/authentication/useAllUsers";
import UserRow from "./UserRow";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

function UsersTable() {
  const { isLoading, allUsers } = useAllUsers();
  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns={"1.8fr 1.8fr 2fr 1fr 0.5fr"}>
        <Table.Header>
          <div>Created at</div>
          <div>Full name</div>
          <div>Email</div>
          <div>Role</div>
        </Table.Header>
        <Table.Body
          data={allUsers}
          render={(user) => <UserRow user={user} key={user.id} />}
        />
      </Table>
    </Menus>
  );
}

export default UsersTable;
