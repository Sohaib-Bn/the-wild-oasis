import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SpinnerFullPage from "../ui/SpinnerFullPage";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // 1. LOADING CURRENT USER
  const { isLoading, isAuthonticated } = useUser();

  // 2. REDIRECT TO LOGIN PAGE IF USER IS'T AUTHORIZED
  useEffect(() => {
    if (!isLoading && !isAuthonticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthonticated, navigate]);

  // 3. RETURN SPINNER WHILE LOAIDNG
  if (isLoading) return <SpinnerFullPage />;

  // 4. RETURN CONTENT IF USER IS AUTHORIZED

  return isAuthonticated ? children : null;
}

export default ProtectedRoute;
