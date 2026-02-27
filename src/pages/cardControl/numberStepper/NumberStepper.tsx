import React, { useCallback } from "react";
import { useLanguage } from "../context/languageContext";

type NumberStepperProps = {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
};

export default function NumberStepper({
  label,
  value,
  min = 1,
  max = 999,
  step = 1,
  onChange,
}: NumberStepperProps) {
  const { getValue } = useLanguage();
  const finalLabel = label ?? getValue("Display_Order");


  const clamp = useCallback(
    (n: number) => Math.max(min, Math.min(max, n)),
    [min, max]
  );

  const inc = () => onChange(clamp(value + step));
  const dec = () => onChange(clamp(value - step));

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\-]/g, "");
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) onChange(clamp(parsed));
    else if (raw === "") onChange(min);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      inc();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      dec();
    }
    if (e.key === "PageUp") {
      e.preventDefault();
      onChange(clamp(value + step * 5));
    }
    if (e.key === "PageDown") {
      e.preventDefault();
      onChange(clamp(value - step * 5));
    }
  };

  return (
    <div className="field">
      <h6 className="label">{finalLabel}</h6>
      <div className="number-stepper">
        <input
          type="text"
          inputMode="numeric"
          className="input base"
          value={value}
          onChange={onInput}
          onKeyDown={onKey}
          aria-label={finalLabel}
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        <div className="stepper-buttons">
          <button
            type="button"
            aria-label="Increase"
            onClick={inc}
            className="btn-step up"
          >
            ▴
          </button>
          <button
            type="button"
            aria-label="Decrease"
            onClick={dec}
            className="btn-step down"
          >
            ▾
          </button>
        </div>
      </div>
    </div>
  );
}
