import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  let synIdParam = "1";
  if (window.location.href.indexOf("?") > 0) {
    synIdParam = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("=")[1];

    console.log(synIdParam);
  }

  root.render(
    <React.StrictMode>
      <App synId={synIdParam} />
    </React.StrictMode>
  );
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
