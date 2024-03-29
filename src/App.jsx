import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import Cabins from "./pages/Cabins";
import Bookings from "./pages/Bookings";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Users from "./pages/Users";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import GlobalStyles from "./styles/GlobalStyles";
import Booking from "./pages/Booking";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import CreateBookin from "./features/bookings/CreateBookin";
import Restaurant from "./pages/Restaurant";
import SpinnerFullPage from "./ui/SpinnerFullPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <GlobalStyles />
      <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="/Dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cabins" element={<Cabins />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/booking/new" element={<CreateBookin />} />
              <Route path="/booking/:bookingId" element={<Booking />} />
              <Route path="/check-in/:bookingId" element={<CheckIn />} />
              <Route path="/check-out/:bookingId" element={<CheckOut />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/account" element={<Account />} />
              <Route path="/users" element={<Users />} />
              <Route path="/restaurant" element={<Restaurant />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toesOpetions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxwidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-50)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
