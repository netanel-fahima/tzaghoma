import React, { useState, useEffect } from "react";
import "./ResponsiveText.css";

const ResponsiveText: React.FC<{
  defaultFontSize?: string;
  title: React.ReactNode; // עדכון הטיפוס לקבלת טקסט או קומפוננטה
  className?: string;
  containerRef: React.MutableRefObject<null>;
}> = ({ containerRef, title, className, defaultFontSize = "15" }) => {
  const [fontSize, setFontSize] = useState(""); // גודל טקסט התחלתי
  const [top, setTop] = useState(400); // גובה האלמנט הראשי

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const newFontSize = `${Math.max(1, width / Number(defaultFontSize))}px`; // חישוב גודל טקסט חדש בהתאם לרוחב
        setFontSize(newFontSize);
        // setTop(height * 0.2); // חישוב גובה האלמנט הראשי
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  //, top: `${top}px`

  if (fontSize === "") return null;
  return (
    <div className={`ResponsiveText ${className}`} style={{ fontSize }}>
      {title}
    </div>
  );
};

export default ResponsiveText;
