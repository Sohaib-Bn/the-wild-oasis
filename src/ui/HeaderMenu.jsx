import styled from "styled-components";
import ButtonIcon from "./ButtonIcon";
import { HiOutlineMoon, HiOutlineSun, HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Logout from "../features/authentication/Logout";
import UserAvatar from "../features/authentication/UserAvatar";
import { useDarkMode } from "../contexts/DarkModeContex";
import { useEffect } from "react";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.8rem;

  align-items: center;
`;

function HeaderMenu() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.querySelector(":root").classList.add("dark-mode");
      document.querySelector(":root").classList.remove("light-mode");
    } else {
      document.querySelector(":root").classList.remove("dark-mode");
      document.querySelector(":root").classList.add("light-mode");
    }
  }, [isDarkMode]);
  const navigate = useNavigate();
  return (
    <StyledHeaderMenu>
      <li>
        <UserAvatar />
      </li>
      <li>
        <ButtonIcon>
          <HiOutlineUser onClick={() => navigate("/account")} />
        </ButtonIcon>
      </li>
      <li>
        <ButtonIcon onClick={toggleDarkMode}>
          {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
