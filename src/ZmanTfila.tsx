import React from "react";
import "./App.css";
import { DraggableText, ResponsiveText } from "./components";

interface ZmanTfilaProps {
  dragKey: string;
  title: string;
  times: any[];
  containerRef: any;
  className?: string;
  defaultPosition: any;
}

const ZmanTfila: React.FC<ZmanTfilaProps> = ({
  times,
  title,
  containerRef,
  className,
  dragKey,
  defaultPosition,
}) => {
  return (
    <DraggableText id={dragKey} defaultPosition={defaultPosition}>
      <div className="Columns">
        <ResponsiveText
          defaultFontSize="60"
          className={className}
          title={title}
          containerRef={containerRef}
        />

        <ResponsiveText
          containerRef={containerRef}
          defaultFontSize="90"
          title={
            <div className="Columns NoWrap">
              {times.map((item, index) => (
                <div className="AreaMessageText" key={index}>
                  {item.Desc} - {item.Hour}
                </div>
              ))}
            </div>
          }
        />
      </div>
    </DraggableText>
  );
};

export default ZmanTfila;
