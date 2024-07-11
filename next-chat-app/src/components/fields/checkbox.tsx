import { Field } from "formik";
import { LocationIconSvg, DeviceIconSvg } from "../../assets/images/logo/logo";

interface CheckboxProps {
  type?: any;
  name?: string;
  id?: string;
  value?: any;
  onChangeCapture?: any;
  select?: any;
  onChange?: any;
  onClick?: any;
}
export function Checkbox({ type, id, name, value, onChange, onClick }: CheckboxProps) {
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
        <span className="form-check-label" style={{ marginLeft: 10, marginTop: 2 }}>
          {value}
        </span>
      </label>
    </div>
  );
}

export function CheckboxLocationsAreas({ type, id, name, value, onChangeCapture, select = "" }: CheckboxProps) {
  return (
    <>
      <label
        htmlFor={id || name}
        className="form-check"
        style={{ marginBottom: 5, padding: "5px 0", width: "100%", display: "flex" }}
      >
        <span className="form-check-label" style={{ fontWeight: 500, fontSize: "110%" }}>
          {select === "location" && (
            <img
              className="text-secondary"
              src={LocationIconSvg}
              alt="Location"
              style={{ height: 20, marginRight: "10px", position: "relative", top: "-2px" }}
            />
          )}
          {select === "area" && (
            <img
              className="text-secondary"
              src={DeviceIconSvg}
              alt="Device"
              style={{ height: 20, marginRight: "10px", position: "relative", top: "-2px" }}
            />
          )}
          {value}
        </span>
        <span style={{ marginLeft: "auto", marginRight: "20px" }}>
          <Field type={type} name={name} id={id} className="form-check-input" onChangeCapture={onChangeCapture} />
        </span>
      </label>
    </>
  );
}
