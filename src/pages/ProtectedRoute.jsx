import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SpinnerFullPage from "../ui/SpinnerFullPage";

// const FullPage = styled.div`
//   height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background-color: var(--color-grey-50);
// `;

function ProtectedRoute({ children }) {
  // 1. LOADING CURRENT USER
  const { isLoading, isAuthonticated } = useUser();
  const navigate = useNavigate();

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
