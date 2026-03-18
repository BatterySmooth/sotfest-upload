import React from "react";
import styles from "@components/ColourHistory.module.css";

interface ColourHistoryProps {
  colours: string[];
  onSelect: (colour: string) => void;
  max?: number;
  className?: string;
}

export const addColourToHistory = (
  history: string[],
  newColour: string,
  max = 20
): string[] => {
  const filtered = history.filter((c) => c !== newColour);
  return [newColour, ...filtered].slice(0, max);
};

export const ColourHistory: React.FC<ColourHistoryProps> = ({
  colours,
  onSelect,
  max = 20,
  className = "",
}) => {
  const visibleColours = colours.slice(0, max);

  return (
    <div className={`${styles.container} ${className}`}>
      {visibleColours.map((colour, index) => (
        <button
          key={`${colour}-${index}`}
          className={styles.swatch}
          style={{ backgroundColor: colour }}
          onClick={() => onSelect(colour)}
          aria-label={`Select colour ${colour}`}
        />
      ))}
    </div>
  );
};