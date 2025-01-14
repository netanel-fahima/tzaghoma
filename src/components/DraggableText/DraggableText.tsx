import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import useDimensions from "../../hooks/useDimensions";
// ES6
//@ts-ignore
import { ResizableBox } from "react-resizable";

const isPortraitMobile = (): boolean => {
  return window.matchMedia(
    "only screen and (max-width: 768px) and (orientation: portrait) "
  ).matches;
};

const isRealMobile = (): boolean => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

// הגדרת טיפוס למצב הפוזיציה
interface Position {
  mobile: { x: number; y: number; width?: number; height?: number };
  desktop: { x: number; y: number; width?: number; height?: number };
}

interface DraggableTextProps {
  children: any;
  id?: string;
  user?: string;
  defaultPosition?: Position;
}

const DraggableText: React.FC<DraggableTextProps> = ({
  children,
  id,
  defaultPosition = {
    mobile: { x: 0, y: 0, width: 0, height: 0 },
    desktop: { x: 0, y: 0, width: 0, height: 0 },
  },
}) => {
  const getInitialPosition = (): Position => {
    const savedPosition = id ? localStorage.getItem(id) : null;
    let position = savedPosition ? JSON.parse(savedPosition) : defaultPosition;
    return position;
  };

  const { maxX, maxY, width, height } = useDimensions();
  const isLandscape = width < height;
  const [position, setPosition] = useState<Position>(getInitialPosition());
  const [escapePressed, setEscapePressed] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef(null);

  const [initialSize, setInitialSize] = useState({
    width: 0,
    height: 0,
  });

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (escapePressed) {
      return;
    }
    const clientX =
      e.type === "touchmove"
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.DragEvent).clientX;
    const clientY =
      e.type === "touchmove"
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.DragEvent).clientY;

    if (clientX === 0 && clientY === 0) return; // אין עדכון אם הקורדינטות הן 0,0
    const newPosition = isPortraitMobile()
      ? {
          mobile: { ...position.mobile, x: clientX, y: clientY },
          desktop: position.desktop,
        }
      : {
          mobile: position.mobile,
          desktop: { ...position.desktop, x: clientX, y: clientY },
        };

    setPosition(newPosition);
    if (id) {
      localStorage.setItem(id, JSON.stringify(newPosition)); // שמירת המיקום ב-localStorage
    }
  };

  const handleDragEnd = (
    e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const currentPosition = isPortraitMobile()
      ? position.mobile
      : position.desktop;
    console.log(
      `Final position - x: ${currentPosition.x}, y: ${currentPosition.y}`
    );

    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragStart = (event: any) => {
    if (escapePressed) {
      return;
    }

    setIsDragging(true);
    // Create an invisible image (transparent GIF)
    const transparentImg = new Image();
    transparentImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // A 1x1 pixel transparent GIF
    event.dataTransfer.setDragImage(transparentImg, 0, 0); // Setting the drag image
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEscapePressed(!escapePressed);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [escapePressed]);

  useEffect(() => {
    setTimeout(() => {
      const observeTarget = ref.current;

      let s = { ...initialSize };
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (!s.width && !s.height) {
            s = isPortraitMobile()
              ? {
                  width: width,
                  height: height,
                }
              : {
                  width: width,
                  height: height,
                };
            setInitialSize(s);
          }
        }
      });

      if (observeTarget) {
        resizeObserver.observe(observeTarget);
      }

      return () => {
        if (observeTarget) {
          resizeObserver.unobserve(observeTarget);
        }
      };
    }, 200);
  }, []);

  //@ts-ignore
  const onResize = (event, { node, size, handle }) => {
    const { width, height } = size;

    const newPosition = isPortraitMobile()
      ? {
          mobile: { ...position.mobile, width, height },
          desktop: position.desktop,
        }
      : {
          mobile: position.mobile,
          desktop: { ...position.desktop, width, height },
        };

    setPosition(newPosition);

    if (id) {
      localStorage.setItem(id, JSON.stringify(newPosition)); // שמירת המיקום ב-localStorage
    }
  };

  useLayoutEffect(() => {
    const checkOverflow = () => {
      setTimeout(() => {
        if (ref.current) {
          const { scrollHeight, clientHeight } = ref.current;
          setHasOverflow(scrollHeight > clientHeight);
        }
      }, 2000);
    };

    checkOverflow();

    // בדיקת overflow בעת שינוי גודל החלון
    setTimeout(() => {
      window.addEventListener("resize", checkOverflow);
    }, 2000);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [width, height, position, escapePressed, isLandscape]);

  let currentPosition = isPortraitMobile() ? position.mobile : position.desktop;
  const titleWidth = (children?.props?.title?.length || 15) * (width * 0.005);
  const left = Math.min(
    currentPosition.x,
    maxX - (isLandscape ? 10 : titleWidth)
  );
  const top = Math.min(
    currentPosition.y,
    maxY - (isLandscape ? titleWidth : 10)
  );

  const dragHeight = position.desktop.height || initialSize.height;
  const dragWidth = position.desktop.width || initialSize.width;

  return (
    <div
      className="DraggableText"
      ref={ref}
      id={id}
      draggable={!escapePressed && !isRealMobile()}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleDrag}
      // onTouchEnd={handleDragEnd}
      style={{
        left: `${isLandscape ? top : left}px`,
        [isLandscape ? "bottom" : "top"]: `${isLandscape ? left : top}px`,
        cursor: escapePressed ? "ew-resize" : "grab",
        zIndex: 100,
        position: "absolute",
        border: escapePressed ? "dashed 1px #000 " : "unset",
        whiteSpace: "pre-wrap",
        overflow: "hidden",
      }}
    >
      {initialSize.height || initialSize.height ? (
        <ResizableBox
          {...(!escapePressed ? { resizeHandles: [] } : {})}
          style={{
            background:
              escapePressed || isDragging
                ? "rgba(255, 255, 255, 0.5)"
                : "unset",
          }}
          minConstraints={[50, 50]}
          maxConstraints={[500, 500]}
          height={dragHeight}
          width={dragWidth}
          onResize={onResize}
        >
          <div
            style={{
              position: "relative",
            }}
            className={`drag-children ${hasOverflow ? "scrolling-text" : ""}`}
          >
            {children}
            {hasOverflow && !isRealMobile() && (
              <style>
                {`
              @keyframes marquee-vertical {
                0% {
                top: ${initialSize.height}px;
                }
                100% {
                top: -${initialSize.height}px;
                }
              }
              `}
              </style>
            )}
          </div>
        </ResizableBox>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default DraggableText;
