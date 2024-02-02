import { useMutation } from "@tanstack/react-query";
import { sendThankYouEmail } from "../../utils/helpers";

export function useSendEmail() {
  const { isPending: isSendingEmail, mutate: sendEmail } = useMutation({
    mutationFn: ({ send_to, html }) => sendThankYouEmail(send_to, html),
  });

  return { isSendingEmail, sendEmail };
}
