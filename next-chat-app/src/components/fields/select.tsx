import React from "react";
import { useField } from "formik";
import classnames from "classnames";
import RSelect from "react-select";

import styles from "./fields.module.scss";

interface SelectProps {
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  options?: any;
  disabled?: boolean;
  disabledPlaceholder?: boolean;
  option?: string;
  style?: any;
  onChange?: (event: any) => void;
  onChangeCapture?: (value: {}) => void;
  className?: any;
  value?: string | number | null;
  required?: boolean;
  defaultValue?: string | number;
}
export function Select({
  name = "",
  id,
  placeholder = "Please select",
  label,
  options,
  disabled,
  disabledPlaceholder = true,
  option,
  onChange,
  onChangeCapture,
  style,
  className = null,
  required,
}: SelectProps) {
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <select
        style={style}
        {...field}
        id={id}
        name={name}
        onChangeCapture={onChangeCapture}
        onChange={(event) => {
          // Call the formik onChange handler first!
          field.onChange(event);
          // Call custom onChange after
          if (onChange) {
            onChange(event);
          }
        }}
        className={classnames(className, isInvalid && styles.invalid)}
        disabled={disabled}
      >
        <option value="" disabled={disabledPlaceholder}>
          {placeholder}
        </option>
        {option}
        {options.map((option: { value: string; label: string }) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isInvalid && <p className={styles.error}>{meta.error}</p>}
    </div>
  );
}

export function ReactSelect({
  name = "",
  id,
  placeholder = "Please select",
  label,
  options,
  disabled,
  onChange,
  value,
  className = null,
  required,
  defaultValue,
}: SelectProps) {
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      <RSelect
        placeholder={placeholder}
        {...field}
        id={id}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        className={classnames(className, isInvalid && styles.invalid)}
        isDisabled={disabled}
        defaultValue={defaultValue}
      />

      {isInvalid && <p className={styles.error}>{meta.error}</p>}
    </div>
  );
}
