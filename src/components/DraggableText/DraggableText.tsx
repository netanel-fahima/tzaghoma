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

const localStorageKeyPrefix = "draggable-text-";

// הגדרת טיפוס למצב הפוזיציה
interface Position {
  mobile: { x: number; y: number; width?: number; height?: number };
  desktop: { x: number; y: number; width?: number; height?: number };
}

interface DraggableTextProps {
  children: any;
  id?: string;
  user?: string;
}

const DraggableText: React.FC<DraggableTextProps> = ({ children, id }) => {
  const getInitialPosition = (): Position => {
    const savedPosition = id
      ? localStorage.getItem(localStorageKeyPrefix + id)
      : null;
    let position = savedPosition
      ? JSON.parse(savedPosition)
      : {
          mobile: { x: 0, y: 0, width: 0, height: 0 },
          desktop: { x: 0, y: 0, width: 0, height: 0 },
        };
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

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: any) => {
    if (escapePressed) {
      return;
    }

    setIsDragging(true);
    // Create an invisible image (transparent GIF)
    if (ref.current) {
      //@ts-ignore
      const rect = ref.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

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
          mobile: {
            ...position.mobile,
            x: clientX - offset.x,
            y: clientY - offset.y,
          },
          desktop: position.desktop,
        }
      : {
          mobile: position.mobile,
          desktop: {
            ...position.desktop,
            x: clientX - offset.x,
            y: clientY - offset.y,
          },
        };

    // if (ref.current) {
    //   //@ts-ignore
    //   e?.dataTransfer?.setDragImage(ref.current, 0, 0);
    // }

    setPosition(newPosition);
    if (id) {
      localStorage.setItem(
        localStorageKeyPrefix + id,
        JSON.stringify(newPosition)
      ); // שמירת המיקום ב-localStorage
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
  const onResize = (event, { size, handle }) => {
    const { width, height } = size;
    const isLeft = handle === "sw";

    setPosition((position) => {
      const newPosition = isPortraitMobile()
        ? {
            mobile: {
              ...position.mobile,
              width,
              height,
              x:
                position.mobile.x +
                (isLeft ? (position.mobile.width ?? 0) - width : 0),
            },
            desktop: position.desktop,
          }
        : {
            mobile: position.mobile,
            desktop: {
              ...position.desktop,
              width,
              height,
              x:
                position.desktop.x +
                (isLeft ? (position.desktop.width ?? 0) - width : 0),
            },
          };

      if (id) {
        localStorage.setItem(
          localStorageKeyPrefix + id,
          JSON.stringify(newPosition)
        );
      }
      return newPosition;
    });
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

  const dragHeight = currentPosition.height || initialSize.height;
  const dragWidth = currentPosition.width || initialSize.width;

  const left = Math.min(Math.max(currentPosition.x, 0), maxX - dragWidth);
  const top = Math.min(Math.max(currentPosition.y, 0), maxY - dragHeight);

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
          resizeHandles={!escapePressed ? [] : ["se", "sw"]}
          style={{
            background:
              escapePressed || isDragging
                ? "rgba(255, 255, 255, 0.25)"
                : "unset",
          }}
          minConstraints={[50, 50]}
          maxConstraints={[500, 500]}
          height={dragHeight}
          width={dragWidth}
          onResize={onResize}
          onResizeStart={(e: any) => e.stopPropagation()}
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
                top: ${dragHeight}px;
                }
                100% {
                top: -${dragHeight}px;
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
