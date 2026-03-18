import React from "react";
import { Stack } from "@components/Stack";
import style from "@components/Slider.module.css";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 50,
  step = 1,
  className = "",
}) => {
  return (
    <Stack row className={`${style.container} ${className}`} gap={"2rem"}>
      <p style={{minWidth: "2rem"}}>{value}</p>
      <input
        type="range"
        className={style.slider}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Stack>
  );
};