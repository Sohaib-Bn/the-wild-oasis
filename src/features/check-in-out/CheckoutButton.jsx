import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

function CheckoutButton({ bookingId }) {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate(`/check-out/${bookingId}`)}
      $variation="primary"
      $size="small"
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
