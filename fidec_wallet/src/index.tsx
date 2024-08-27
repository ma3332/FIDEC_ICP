import * as React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./app";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { StyleProvider } from "@ant-design/cssinjs";
import "./styles/global.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <StyleProvider hashPriority="high">
      <App />
    </StyleProvider>
  </Provider>
);
