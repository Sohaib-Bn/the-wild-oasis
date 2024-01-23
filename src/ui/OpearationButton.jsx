import styled from "styled-components";

const OperationButton = styled.button`
  display: flex;
  align-items: center;
  border-radius: var(--border-radius-sm);
  padding: 0.84rem 1rem;

  background-color: var(--color-brand-600);
  border: none;
  color: var(--color-brand-50);

  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  transition: all 0.3s;

  &:hover {
    background-color: var(--color-brand-700);
  }
`;

export default OperationButton;
