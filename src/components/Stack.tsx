import React from "react";
import styles from "@components/Stack.module.css";

interface StackProps {
  row?: boolean;
  gap?: number | string;
  className?: string;
  children: React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({
  row = false,
  gap = "0.5rem",
  className = "",
  children,
}) => {
  return (
    <div
      className={`${styles.stack} ${styles[row ? 'row' : 'column']} ${className}`}
      style={{ gap }}
    >
      {children}
    </div>
  );
};