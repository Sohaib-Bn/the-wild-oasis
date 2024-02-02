import { Email, Item, Span } from "react-html-email";
import { formatCurrency } from "../utils/helpers";
import { format } from "date-fns";

function ThankYouEmailTemplate({ bookingData, bills }) {
  const fullName = bookingData.guests.fullName;
  return (
    <Email title="Thank You for Staying with Us!">
      <Item>
        <h2 style={{ textAlign: "left" }}>
          <strong>
            Dear{" "}
            {fullName.split(" ")[0].charAt(0).toUpperCase() +
              fullName.split(" ")[0].slice(1).toLowerCase()}
          </strong>
          ,
        </h2>
        <p>
          Thank you for choosing our service. We appreciate your stay with us.
        </p>
        <h3>Booking Information:</h3>
        <ul>
          <li>Cabin Name: {bookingData.cabins.name}</li>
          <li>Cabin Price: {formatCurrency(bookingData.cabinPrice)}</li>
          <li>Extras Price: {formatCurrency(bookingData.extrasPrice)}</li>
          <li>Total Price: {formatCurrency(bookingData.totalPrice)}</li>
          <li>
            Bills:{" "}
            {Boolean(bills.length) ? bills.length : "No bills registered"}
          </li>
        </ul>
      </Item>

      {Boolean(bills.length) && (
        <Item>
          <h3>Your bills:</h3>
          <h4>
            <strong>Total Bills Price:</strong>{" "}
            {formatCurrency(
              bills
                .map((bill) => bill.totalPrice)
                .reduce((cur, acc) => cur + acc, 0)
            )}
          </h4>

          {bills.map((bill, index) => {
            const items = JSON.parse(bill.items);
            return (
              <div key={bill.id} style={{ marginBottom: "20px" }}>
                <Item>
                  <Span>
                    <strong>Bill {index + 1}:</strong>
                    <br />
                    <p>
                      Registered at{" "}
                      {format(new Date(bill.created_at), "EEE, MMM dd yyyy")}
                    </p>
                    {bill.observation !== "" && (
                      <p>Observation: {bill.observation}</p>
                    )}
                    {items.map((item, i) => (
                      <p key={i}>
                        {item.quantity} x {item.name} -{" "}
                        {formatCurrency(item.price)}
                      </p>
                    ))}
                    <strong>Total Price:</strong>{" "}
                    {formatCurrency(bill.totalPrice)}
                  </Span>
                </Item>
              </div>
            );
          })}
        </Item>
      )}

      <hr />

      <Item>
        <p>
          If you have any questions, feel free to contact us:{" "}
          <strong> theWildOasisSupport@gmail.com</strong>
        </p>
        <p> Best regards,</p>
        <p>The wild Oasis</p>

        <p>Safe travels!</p>
      </Item>
    </Email>
  );
}

export default ThankYouEmailTemplate;
