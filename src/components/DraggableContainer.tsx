import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import styles from "@components/DraggableContainer.module.css";

type Position = {
  x: number;
  y: number;
};

type DraggableContainerProps = {
  children: React.ReactNode;
};

export const DraggableContainer: React.FC<DraggableContainerProps> = ({ children }) => {
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 });
  const dragging = useRef<boolean>(false);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    const boxRect = boxRef.current?.getBoundingClientRect();
    if (!containerRect || !boxRect) return;
    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;
    newX = clamp(newX, 0, containerRect.width - boxRect.width);
    newY = clamp(newY, 0, containerRect.height - boxRect.height);
    setPosition({ x: newX, y: newY });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={boxRef} className={styles.box} style={{ left: position.x, top: position.y }}>
        <div
          className={styles.handle}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}