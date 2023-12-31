import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import App from "./App";
import GlobalStyle from "./global";
import store from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = {
  background: "#FFACAC",
};
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
