import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/apiAuth";

export function useAllUsers() {
  const { isLoading, data: allUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const numAdminsUsers = allUsers?.filter(
    (user) => user.user_metadata.role === "admin"
  ).length;

  return { isLoading, allUsers, numAdminsUsers };
}
