import { useLanguage } from "../context/languageContext";

type ToggleProps = {
  label?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

export default function ToggleSwitch({
  label,
  checked,
  onChange,
}: ToggleProps) {
  const { getValue } = useLanguage();
  const finalLabel = label ? getValue(label) : getValue("Show_User");
  return (
    <div className="field">

      <div className="toggle-row">
        <span className="toggle-text">{finalLabel}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={`switch ${checked ? "on" : "off"}`}
          onClick={() => onChange(!checked)}
        >
          <span className="knob" />
        </button>
      </div>
    </div>
  );
}
