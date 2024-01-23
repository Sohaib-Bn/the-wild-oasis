import styled from "styled-components";
import { RiAlarmWarningFill } from "react-icons/ri";
import Button from "./Button";

const BoxWarning = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-${(props) => props.$type}-100);
  color: var(--color-${(props) => props.$type}-700);
  font-size: 1.3rem;
  padding: 1.3rem 2rem;
  border-radius: 3px;

  grid-column: -1/1;
`;

const ContentWarning = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

function Warning({ children, type, buttonContent, handleClick }) {
  return (
    <BoxWarning $type={type}>
      <ContentWarning>
        <span> {<RiAlarmWarningFill size={15} />}</span>
        <span> {children}</span>
      </ContentWarning>
      {buttonContent && (
        <Button onClick={handleClick} $variation="danger">
          {buttonContent}
        </Button>
      )}
    </BoxWarning>
  );
}

BoxWarning.defaultProps = {
  $type: "yellow",
};

export default Warning;
