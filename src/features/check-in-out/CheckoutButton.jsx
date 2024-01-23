import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";

function CheckoutButton({ bookingId }) {
  const { isPending, checkout } = useCheckout();
  return (
    <Button
      disabled={isPending}
      onClick={() => checkout(bookingId)}
      $variation="primary"
      $size="small"
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
