import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo({ imgaeSrc }) {
  return (
    <StyledLogo>
      <Img src={imgaeSrc || "/logo-light.png"} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
