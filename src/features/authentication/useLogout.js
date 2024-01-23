import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending, mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.resetQueries();
      navigate("/login");
    },
    onError: () => {
      toast.error("Something was wrong. Try again");
    },
  });

  return { isPending, logout };
}
