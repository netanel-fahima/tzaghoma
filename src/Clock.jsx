import { useState, useEffect } from "react";
import './App.css';
import ResponsiveText from "./components/ResponsiveText/ResponsiveText";
import DraggableText from "./components/DraggableText/DraggableText";

const Clock = ({ container }) => {
  const [ctime, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const time = new Date().toLocaleTimeString().split(" ")[0].padStart(8, '0');
      setTime(time);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    // <DraggableText
    //   id="Clock"
    //   defaultPosition={{
    //     desktop: { x: 113, y: 139 },
    //     mobile: { x: 0, y: 0 },
    //   }}
    // >
      <ResponsiveText
        defaultFontSize="35"
        className="Clock"
        title={ctime}
        containerRef={container}
      />
    // </DraggableText>
  );
};

export default Clock;
