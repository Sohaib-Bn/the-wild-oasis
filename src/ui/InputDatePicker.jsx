import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const SyledDatePicker = styled(DatePicker)`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  width: 100%;
`;

function InputDatePicker({ value, handleChange, dateFormat, id, ...props }) {
  return (
    <SyledDatePicker
      id={id}
      selected={value}
      onChange={handleChange}
      dateFormat={dateFormat}
      {...props}
    />
  );
}

InputDatePicker.defaultProps = {
  dateFormat: "P",
};
export default InputDatePicker;
