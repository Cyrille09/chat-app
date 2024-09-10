import React from "react";
import { useField } from "formik";
import classnames from "classnames";

import styles from "./fields.module.scss";

interface InputProps {
  type?: string;
  name: string;
  id: string;
  placeholder?: string;
  label?: string;
  size?: string;
  disabled?: boolean;
  className?: any;
  min?: number;
  required?: boolean;
  max?: number;
  onBlur?: (value: {}) => void;
  autoCapitalize?: string;
  onChange?: (value: any) => void;
  autoCorrect?: string;
  style?: any;
  error: any;
  onChangeCapture?: (value: {}) => void;
  onKeyDown?: any;
  children?: React.ReactNode;
}

export function Input({
  type,
  name = "",
  id,
  placeholder,
  label = "",
  size = "",
  disabled,
  className = null,
  min,
  required,
  max,
  onBlur,
  autoCapitalize,
  onChange,
  autoCorrect,
  style,
  onChangeCapture,
  onKeyDown,
}: InputProps) {
  // return field name for an <input />
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        style={style}
        {...field}
        type={type}
        id={id}
        name={name}
        className={classnames(
          "form-control",
          size,
          isInvalid && styles.isInvalid
        )}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        onChange={onChange}
        autoCorrect={autoCorrect}
        onChangeCapture={onChangeCapture}
        onKeyDown={onKeyDown}
      />
      {isInvalid && <p className={styles.invalidFeedback}>{meta.error}</p>}
    </div>
  );
}

export function InputWrapper({
  type,
  name = "",
  id,
  placeholder,
  label = "",
  size = "",
  disabled,
  className = null,
  min,
  required,
  max,
  onBlur,
  autoCapitalize,
  onChange,
  autoCorrect,
  style,
  onChangeCapture,
  children,
}: InputProps) {
  // return field name for an <input />
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <span
        style={style}
        {...field}
        id={id}
        className={classnames(
          "form-control",
          size,
          isInvalid && styles.isInvalid
        )}
        // placeholder={placeholder}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        onChange={onChange}
        autoCorrect={autoCorrect}
        onChangeCapture={onChangeCapture}
      >
        {children}
      </span>
      {isInvalid && <p className={styles.invalidFeedback}>{meta.error}</p>}
    </div>
  );
}
