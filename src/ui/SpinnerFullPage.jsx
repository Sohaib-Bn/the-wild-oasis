import styled from "styled-components";
import Spinner from "./Spinner";

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-grey-50);
`;

function SpinnerFullPage() {
  return (
    <FullPage>
      <Spinner />
    </FullPage>
  );
}

export default SpinnerFullPage;
