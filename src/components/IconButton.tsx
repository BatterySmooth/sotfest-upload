import React from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@components/IconButton.module.css";

interface IconButtonProps {
  icon: IconDefinition;
  onClick?: () => void;
  ariaLabel?: string;
  active?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  active = false,
  disabled = false,
  backgroundColor,
}) => {
  return (
    <button
      className={`${styles.button} ${active ? styles.active : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{backgroundColor: backgroundColor}}
    >
      <FontAwesomeIcon icon={icon} className={styles.icon} />
    </button>
  );
};