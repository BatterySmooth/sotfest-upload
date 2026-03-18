import React, { useState, useRef, useEffect } from "react";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HexColorPicker } from "react-colorful";
import buttonstyles from "@components/IconButton.module.css";
import style from "@components/ColourPicker.module.css";

interface ColourPickerProps {
  value: string;
  onChange?: (color: string) => void;
  onChangeComplete?: (color: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export const ColourPicker: React.FC<ColourPickerProps> = ({
  value,
  onChange,
  onChangeComplete,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  // Update temp colour
  useEffect(() => setTempColor(value), [value]);

  // Notify of open
  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);


  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (onOpenChange) { onOpenChange(false); }
        onChangeComplete?.(tempColor);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tempColor, onChangeComplete]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>

      <button onClick={() => setOpen((o) => !o)} className={buttonstyles.button}>
        <FontAwesomeIcon icon={faPalette} className={buttonstyles.icon} />
      </button>

      {open && (
        <div className={style.popover} >
          <HexColorPicker
          color={tempColor}
            onChange={(c) => {
              setTempColor(c);
              if (onChange) { onChange(c); }
            }} />
        </div>
      )}
    </div>
  );
};