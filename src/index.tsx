import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import configData1 from "./conf/defaultDragFrames.json";
import configData2 from "./conf/defaultTextStyle.json";

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

  const getJson = (key: string) => {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : {};
    } catch (e) {
      return {};
    }
  };

  // פונקציה לאתחול ה-local storage
  const initializeLocalStorage = (configData: { [key: string]: any }) => {
    console.log("initializeLocalStorage");
    Object.keys(configData).forEach((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({ ...configData[key], ...getJson(key) })
      );
    });
  };

  // אתחול עבור כל קובץ קונפיגורציה
  initializeLocalStorage(configData1);
  initializeLocalStorage(configData2);
  // קריאה לפונקציה עבור כל קובץ נוסף

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
