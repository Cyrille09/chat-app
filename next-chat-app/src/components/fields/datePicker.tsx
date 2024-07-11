import { DatePicker } from "antd";
import classnames from "classnames";

// style components
import styles from "./fields.module.scss";

const { RangePicker } = DatePicker;

interface DatePickerProps {
  name?: string;
  id?: string;
  label?: string;
  onChange?: any;
  disabled?: boolean;
  defaultPickerValue?: any;
  className?: any;
  error?: any;
  required?: boolean;
}
const dateFormat = "DD/MM/YYYY";
export const DateRangePicker = ({
  className = null,
  label,
  id = "rangeDate",
  error,
  name,
  disabled,
  onChange,
  defaultPickerValue,
  required,
}: DatePickerProps) => {
  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <RangePicker
        disabled={disabled}
        id={id}
        onChange={onChange}
        format={dateFormat}
        defaultValue={defaultPickerValue}
      />
      {error && <p className={styles.invalidFeedback}>{error}</p>}
    </div>
  );
};

export const SingleDatePicker = ({
  className = null,
  label,
  id = "singleDate",
  error,
  name = "",
  disabled,
  onChange,
  defaultPickerValue,
  required,
}: DatePickerProps) => {
  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <DatePicker
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        format={dateFormat}
        defaultValue={defaultPickerValue}
      />
      {error && <p className={styles.invalidFeedback}>{error}</p>}
    </div>
  );
};
