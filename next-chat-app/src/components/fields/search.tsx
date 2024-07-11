import { Typeahead } from "react-bootstrap-typeahead";
import classnames from "classnames";
import { useField } from "formik";
// import { Input } from "antd";
import { BsQuestionCircle } from "react-icons/bs";

import "react-bootstrap-typeahead/css/Typeahead.css";

import styles from "./fields.module.scss";
import { Tooltip } from "../tooltip";
// const { Search } = Input;

interface ToggleProps {
  name?: string;
  id: string;
  label?: string;
  className?: any;
  required?: boolean;
  placeholder?: string;
  options?: any;
  rightIcon?: boolean;
  leftIcon?: any;
  multiple?: boolean;
  labelKey: string;
  onChange?: any;
  clearButton?: boolean;
  selected?: any;
  paginate?: boolean;
  minLength?: number;
  size?: "sm" | "lg";
  maxResults?: number;
  emptyLabel?: string;
  defaultSelected?: any;
  highlightOnlyResult?: boolean;
  autoFocus?: boolean;
  renderMenuItemChildren?: any;
  filterBy?: any;
  props?: any;
  onInputChange?: any;
  onFocus?: any;
  maxWidth?: string;
  tooltipIcon?: boolean;
  tooltipMessage?: string;
  additionalContent?: any;
}
export function SearchWithOptions({
  className = null,
  label,
  required,
  id = "global-id",
  name = "",
  placeholder,
  options,
  rightIcon,
  leftIcon,
  multiple,
  labelKey,
  onChange,
  clearButton,
  selected,
  paginate,
  minLength,
  size,
  maxResults,
  emptyLabel,
  defaultSelected,
  highlightOnlyResult,
  autoFocus,
  renderMenuItemChildren,
  filterBy,
  onInputChange,
  onFocus,
  maxWidth = "25rem",
  tooltipIcon = false,
  tooltipMessage = "message here...",
  additionalContent,
}: ToggleProps) {
  const [field, meta] = useField(id);
  const isInvalid = meta.error && meta.touched;

  const ToggleButton = ({ isOpen, onClick }: any) => (
    <span>
      {leftIcon && (
        <div
          className={
            "input-group-prepend input-group-text " + styles.formSearchIcon
          }
        >
          {leftIcon}
        </div>
      )}
      {rightIcon && !clearButton && (
        <button
          className={styles.toggleButton}
          onClick={onClick}
          onMouseDown={(e) => {
            // Prevent input from losing focus.
            e.preventDefault();
          }}
        >
          {isOpen ? "▲" : "▼"}
        </button>
      )}
    </span>
  );

  return (
    <div
      className={classnames("input-group", styles.formSearch)}
      style={{ maxWidth: maxWidth }}
    >
      {label && (
        <label
          htmlFor={id || name}
          className={classnames(styles.label, styles.checkboxLine)}
        >
          {label} {""}
          {""}{" "}
          {required && <span style={{ color: "red", marginLeft: 5 }}>*</span>}
          {""}{" "}
          {additionalContent && (
            <span style={{ marginLeft: 10 }}>{additionalContent}</span>
          )}
          {tooltipIcon && (
            <span className="position-relative">
              <span className={styles.tooltipIcon}>
                <BsQuestionCircle
                  className="lead bi-question-circle ms-1"
                  style={{
                    fontSize: "1rem",
                    position: "relative",
                    top: "-1px",
                  }}
                />
              </span>
              <span className={styles.tooltipIconHide}>
                <Tooltip message={tooltipMessage} />
              </span>
            </span>
          )}
        </label>
      )}

      <div className={styles.formSearch} style={{ maxWidth: maxWidth }}>
        <Typeahead
          {...field}
          className={className}
          filterBy={filterBy}
          labelKey={labelKey}
          id={id}
          options={options}
          placeholder={placeholder}
          multiple={multiple}
          onChange={onChange}
          clearButton={clearButton}
          selected={selected}
          paginate={paginate}
          minLength={minLength}
          size={size}
          maxResults={maxResults}
          emptyLabel={emptyLabel}
          defaultSelected={defaultSelected}
          highlightOnlyResult={highlightOnlyResult}
          renderMenuItemChildren={renderMenuItemChildren}
          autoFocus={autoFocus}
          onInputChange={onInputChange}
          onFocus={onFocus}
        >
          {({ isMenuShown, toggleMenu }) => (
            <ToggleButton isOpen={isMenuShown} onClick={() => toggleMenu()} />
          )}
        </Typeahead>
        {isInvalid && <p className={styles.invalidFeedback}>{meta.error}</p>}
      </div>
    </div>
  );
}

// interface SearchInputProps {
//   placeholder?: string;
//   size?: "small" | "middle" | "large";
//   onSearch?: any;
//   allowClear?: boolean;
//   style?: any;
//   className?: any;
// }
// export function SearchInput({
//   onSearch,
//   size,
//   placeholder = "Search",
//   allowClear,
//   style,
//   className,
// }: SearchInputProps) {
//   return (
//     <Search
//       placeholder={placeholder}
//       onSearch={onSearch}
//       allowClear={allowClear}
//       style={style}
//       className={className}
//       size={size}
//     />
//   );
// }
