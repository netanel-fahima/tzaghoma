import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AlertPopup.css";

interface Alert {
  alertDate: string;
  title: string;
  data: string;
  category: number;
}

const AlertPopup: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios
          .get(
            "https://www.oref.org.il/warningMessages/alert/History/AlertsHistory.json",
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          )
          .catch((error) => {
            console.error("Error fetching alerts:", error);
            return {
              data: [
                {
                  alertDate: "2025-03-19 12:17:01",
                  title: "חדירת מחבלים",
                  data: "קריית נטפים",
                  category: 10,
                },
              ],
            };
          });

        if (response.data && response.data.length > 0) {
          setAlerts(response.data);
          setShow(true);

          // Hide after 10 seconds
          setTimeout(() => {
            setShow(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    // Check for alerts every 5 seconds
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!show || alerts.length === 0) return null;

  return (
    <div className={`alert-popup ${show ? "show" : ""}`}>
      <div className="alert-content">
        <div className="alert-header">
          <img
            src="/img/pikud_haaoref.jpg"
            alt="פיקוד העורף"
            className="alert-logo"
          />
          <h2>התראת פיקוד העורף</h2>
        </div>
        {alerts.map((alert, index) => (
          <div key={index} className="alert-message">
            <div className="alert-title">{alert.title}</div>
            <div className="alert-location">{alert.data}</div>
            <div className="alert-time">
              {new Date(alert.alertDate).toLocaleTimeString("he-IL")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPopup;
