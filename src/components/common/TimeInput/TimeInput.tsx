import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./TimeInput.scss";

interface TimeInputProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  isInvalid?: boolean;
  className?: string;
  disabled?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value = "",
  onChange,
  name,
  required,
  isInvalid,
  className = "",
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState("");

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (timeString: string) => {
    if (!timeString) return "";

    // Check if it's already in 24-hour format (HH:MM)
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // Handle 12-hour format (HH:MM AM/PM)
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = timeString.match(timeRegex);

    if (!match) return timeString; // Return as is if format doesn't match

    const [, hours, minutes, period] = match;
    let hours24 = parseInt(hours, 10);

    if (period.toUpperCase() === "AM" && hours24 === 12) {
      hours24 = 0;
    } else if (period.toUpperCase() === "PM" && hours24 !== 12) {
      hours24 += 12;
    }

    return `${hours24.toString().padStart(2, "0")}:${minutes}`;
  };

  // Convert input time (24-hour from HTML input) to 24-hour format
  const handleTimeInput = (inputTime: string) => {
    if (!inputTime) return "";

    // HTML time input always gives us 24-hour format (HH:MM)
    // We just need to pass it through as is
    return inputTime;
  };

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const time24 = convertTo24Hour(value);
      setInternalValue(time24);
    }
  }, [value]);

  const handleTimeChange = (newTime: string) => {
    const time24 = handleTimeInput(newTime);
    setInternalValue(time24);
    onChange(time24);
  };

  return (
    <div className={`time-input-wrapper ${className}`}>
      <div className="time-input-container">
        <Form.Control
          type="time"
          value={internalValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          name={name}
          required={required}
          isInvalid={isInvalid}
          disabled={disabled}
          className="time-input-native"
          
        />
      </div>
      {/* {internalValue && (
        <small className="time-display text-muted">
          {convertTo12Hour(internalValue)}
        </small>
      )} */}
    </div>
  );
};

export default TimeInput;
