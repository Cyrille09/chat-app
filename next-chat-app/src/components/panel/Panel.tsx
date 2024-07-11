import { useEffect } from "react";
import classnames from "classnames";

import styles from "./panel.module.scss";

// style components
interface PanelProps {
  width?: string;
  maxWidth?: string;
  title: any;
  show: boolean;
  footer?: any;
  handleClose: any;
  children: any;
}

export const Panel = ({
  width = "50%",
  maxWidth = "400px",
  title,
  show,
  handleClose,
  children,
  footer,
}: PanelProps) => {
  useEffect(() => {
    // document.body.classList.remove("overflow-hidden");
    // if (show) {
    //   document.body.classList.add("overflow-hidden");
    // }
  }, [show]);

  return (
    <div
      className={classnames(
        show
          ? `panel ${styles.panel} ${styles.panel_visible}`
          : `panel ${styles.panel}`
      )}
    >
      <div
        className={classnames(
          `${styles.panel_container} ${styles.panel_container}`
        )}
        style={{ width: width, maxWidth: maxWidth }}
      >
        <header className={styles.panel_header}>
          <h3 className={styles.panel_title}>{title}</h3>
          <button
            type="button"
            className={classnames(`${styles.panel_close} btn-close`)}
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </header>
        <div className={styles.panel_content}>{children}</div>
        {footer}
      </div>
      <div className={styles.panel_backdrop} onClick={handleClose}></div>
    </div>
  );
};
