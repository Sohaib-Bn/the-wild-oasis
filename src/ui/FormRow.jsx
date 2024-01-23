import styled, { css } from "styled-components";
import Warning from "./Warning";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;

  grid-template-columns: ${(props) =>
    props.$orientation === "vertical" ? "1fr" : "24rem 1fr 1.2fr"};
  gap: ${(props) => (props.$orientation === "vertical" ? "0.8rem" : "2.4rem")};

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: ${(props) =>
      props.$orientation === "vertical"
        ? "none"
        : "1px solid var(--color-grey-100)"};
  }

  ${(props) =>
    props.$orientation !== "vertical" &&
    props.$type === "submit" &&
    css`
      display: flex;
      justify-content: flex-end;
      gap: 1.2rem;
    `}
`;

const Label = styled.label`
  font-weight: 500;

  ${(props) =>
    props.$type === "dynamicInputs" &&
    css`
      align-self: flex-start;
      transform: translateY(30%);
    `}
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function FormRow({
  label,
  error,
  warning,
  children,
  orientation,
  type,
  warningType,
}) {
  return (
    <StyledFormRow $type={type} $orientation={orientation}>
      {label && (
        <Label $type={type} htmlFor={children.props.id}>
          {label}
        </Label>
      )}
      {children}
      {error && <Error>{error}</Error>}
      {warning && <Warning type={warningType}>{warning}</Warning>}
    </StyledFormRow>
  );
}

export default FormRow;
