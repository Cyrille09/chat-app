import React from "react";
import classnames from "classnames";
import { Field } from "formik";
import styles from "./fields.module.scss";
import { Tooltip } from "../tooltip";

interface ToggleProps {
  type?: any;
  name?: string;
  id?: string;
  label?: string;
  checked?: boolean;
  size?: string;
  rightLabel?: boolean;
  onChangeCapture?: (value: {}) => void;
  onChange: (value: {}) => void;
  className?: any;
  disabled?: boolean;
  labelClassName?: any;
  style?: any;
  tooltipMessage?: string;
  required?: boolean;
}
export function Toggle({
  className = null,
  label,
  size,
  type,
  id,
  name,
  rightLabel,
  onChangeCapture,
  onChange,
  disabled,
  labelClassName = "",
  style,
  tooltipMessage,
  required,
}: ToggleProps) {
  return (
    <div className={classnames("form-check form-switch", className)}>
      {label && !rightLabel && (
        <label htmlFor={id || name} className="form-check-label">
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      <span className="position-relative">
        <span className={styles.tooltipIcon}>
          <Field
            onChangeCapture={onChangeCapture}
            type={type}
            id={id}
            name={name}
            onChange={onChange}
            className={classnames("form-check-input", styles.formCheckInput)}
            disabled={disabled}
            style={style}
          />
        </span>
        {tooltipMessage && (
          <span className={styles.tooltipIconHide}>
            <Tooltip message={tooltipMessage} />
          </span>
        )}
      </span>

      {label && rightLabel && (
        <label
          htmlFor={id || name}
          className={classnames("form-check-label", labelClassName)}
        >
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
    </div>
  );
}
