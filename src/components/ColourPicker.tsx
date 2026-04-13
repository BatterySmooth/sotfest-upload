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
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  // Compute position on open
  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedHeight = 250;
    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      setPlacement("top");
    } else {
      setPlacement("bottom");
    }
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>

      <button ref={buttonRef} onClick={() => setOpen((o) => !o)} className={buttonstyles.button}>
        <FontAwesomeIcon icon={faPalette} className={buttonstyles.icon} />
      </button>

      {open && (
        <div
          ref={popoverRef}
          className={style.popover}
          style={{
            top: placement === "bottom" ? "110%" : "auto",
            bottom: placement === "top" ? "110%" : "auto",
          }}
        >
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