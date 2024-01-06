import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";

function CheckoutButton({ bookingId }) {
  const { isLoading, checkout } = useCheckout();
  return (
    <Button
      disabled={isLoading}
      onClick={() => checkout(bookingId)}
      $variation="primary"
      $size="small"
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
