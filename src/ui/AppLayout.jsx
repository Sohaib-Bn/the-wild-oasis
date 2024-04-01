import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import {
  DarkModeContextProvider,
  useDarkMode,
} from "../contexts/DarkModeContex";

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: scroll;
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto auto 1fr;
  height: 100vh;
`;

const Note = styled.header`
  height: 6rem;
  width: 100%;
  background-color: var(--color-yellow-100);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Link = styled.a`
  color: var(--color-brand-700);
  margin: 0 0.5rem;
`;

function AppLayout() {
  return (
    <DarkModeContextProvider>
      <NoteComponent />
      <StyledAppLayout>
        <Header />
        <Sidebar />
        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </StyledAppLayout>
    </DarkModeContextProvider>
  );
}

export default AppLayout;

function NoteComponent() {
  const { isRegularUser } = useDarkMode();

  console.log(isRegularUser);

  if (!isRegularUser) return null;

  return (
    <Note>
      👋 Data mutations (create, update, delete) are deactivated for regular
      account. please{" "}
      <Link href="https://sodev.live#contact " target="blank">
        contact
      </Link>{" "}
      me if you want to admin version
    </Note>
  );
}
