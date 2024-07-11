import React from "react";

// style components
import styles from "./tooltip.module.scss";

export const Tooltip = ({ message }: { message: string }) => {
  return <div className={styles.loading}>{message}</div>;
};
