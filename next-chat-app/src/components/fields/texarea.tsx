import { useField } from "formik";
import classnames from "classnames";

import styles from "./fields.module.scss";

interface TextareaProps {
  name: string;
  id?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  rows?: number;
  className?: any;
  style?: any;
  playlistModalStyle?: any;
  required?: boolean;
  onChangeCapture?: any;
}
export function Textarea({
  name = "",
  id,
  placeholder,
  label,
  disabled,
  rows = 2,
  className = null,
  style = null,
  playlistModalStyle = null,
  required,
  onChangeCapture,
}: TextareaProps) {
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <textarea
        {...field}
        id={id}
        name={name}
        className={classnames(
          playlistModalStyle ? playlistModalStyle : styles.input,
          styles.textarea,
          isInvalid && styles.invalid
        )}
        style={style}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onChangeCapture={onChangeCapture}
      ></textarea>
      {isInvalid && <p className={styles.error}>{meta.error}</p>}
    </div>
  );
}
