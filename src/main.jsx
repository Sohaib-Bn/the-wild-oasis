import { ErrorBoundary } from "react-error-boundary";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorFallBack from "../src/ui/ErrorFallback.jsx";
import GlobalStyles from "./styles/GlobalStyles.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyles />
    <ErrorBoundary
      onReset={() => window.location.replace("/")}
      FallbackComponent={ErrorFallBack}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
