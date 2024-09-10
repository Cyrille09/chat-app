import { Field } from "formik";

interface CheckboxProps {
  type?: string;
  name?: string;
  id?: string;
  value?: string;
  onChangeCapture?: (value: {}) => void;
  select?: string;
  onChange?: (value: {}) => void;
  onClick?: (value: {}) => void;
}
export function Checkbox({
  type,
  id,
  name,
  value,
  onChange,
  onClick,
}: CheckboxProps) {
  return (
    <div>
      <label htmlFor={id || name} className="form-check">
        <Field
          type={type}
          name={name}
          id={id}
          className="form-check-input"
          onChangeCapture={onChange}
          onClick={onClick}
        />
        <span
          className="form-check-label"
          style={{ marginLeft: 10, marginTop: 2 }}
        >
          {value}
        </span>
      </label>
    </div>
  );
}
