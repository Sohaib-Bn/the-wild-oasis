import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;

  ${(props) =>
    props.$gap &&
    css`
      gap: ${props.$gap}rem;
      align-items: center;
    `}

  ${(props) =>
    props.$type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}

  ${(props) =>
    props.$type === "vertical" &&
    !props.$gap &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

Row.defaultProps = {
  $type: "vertical",
};

export default Row;
