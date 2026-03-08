import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastProvider } from "./Context/ToastContext.tsx";
import { store } from "./Store";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./errorBoundary/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          {" "}
          <ToastProvider>
            <App />
          </ToastProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
