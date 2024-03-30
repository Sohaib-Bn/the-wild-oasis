import emailjs from "emailjs-com";

import { differenceInDays, format, formatDistance, parseISO } from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);

  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

// sendEmail.js
export async function sendThankYouEmail(send_to, html) {
  const apiKey = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_API_KEY;

  const templateParams = {
    send_to: send_to,
    subject: "Thank You for Staying with Us!",
    html: html,
  };

  const { text } = await emailjs.send(
    "service_fyjqio5",
    "template_3698odb",
    templateParams,
    apiKey
  );

  if (text !== "OK") {
    console.error("Email failed to send");
    throw new Error("Email failed to send");
  }
}

export function generateThankYouEmailHtml({ bookingData, bills }) {
  const fullName =
    bookingData.guests.fullName.split(" ")[0].charAt(0).toUpperCase() +
    bookingData.guests.fullName.split(" ")[0].slice(1).toLowerCase();

  const bookingInfo = `
    <h3>Booking Information:</h3>
    <ul>
      <li>Cabin Name: ${bookingData.cabins.name}</li>
      <li>Cabin Price: ${formatCurrency(bookingData.cabinPrice)}</li>
      <li>Extras Price: ${formatCurrency(bookingData.extrasPrice)}</li>
      <li>Total Price: ${formatCurrency(bookingData.totalPrice)}</li>
      <li>Bills: ${
        Boolean(bills.length) ? bills.length : "No bills registered"
      }</li>
    </ul>
  `;

  const billsInfo = Boolean(bills.length)
    ? bills
        .map((bill, index) => {
          const items = JSON.parse(bill.items);
          const billDetails = `
          <div key=${bill.id} style={{ marginBottom: "20px" }}>
            <h3>Bill ${index + 1}:</h3>
            <p>Registered at ${format(
              new Date(bill.created_at),
              "EEE, MMM dd yyyy"
            )}</p>
            ${
              bill.observation !== ""
                ? `<p>Observation: ${bill.observation}</p>`
                : ""
            }
            ${items
              .map(
                (item, i) =>
                  `<p key=${i}><strong>${item.quantity}</strong> x ${
                    item.name
                  } - <strong>${formatCurrency(item.price)}</strong></p>`
              )
              .join("")}
            <strong>Total Price:</strong> ${formatCurrency(bill.totalPrice)}
          </div>
        `;
          return billDetails;
        })
        .join("")
    : "";

  const emailBody = `
    <h2>Dear ${fullName},</h2>
    <p>Thank you for choosing our service. We appreciate your stay with us.</p>
    <div>
    ${bookingInfo}
    </div>
   <div>
    <h3>Your bills:</h3>
    <h4><strong>Total Bills Price:</strong> $256.65</h4>
    ${billsInfo}
   </div>
    <hr />
    <p>If you have any questions, feel free to contact us: <strong>theWildOasisSupport@gmail.com</strong></p>
    <p>Best regards,</p>
    <p>The wild Oasis</p>
    <p>Safe travels!</p>
  `;

  return emailBody;
}
