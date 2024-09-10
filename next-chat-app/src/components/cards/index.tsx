import classnames from "classnames";

import "./box-shadow-card.scss";
import React from "react";

export const BoxShadowCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: any;
}) => {
  return (
    <div className={classnames("box-shadow-main", className)}>
      <div>{children}</div>
    </div>
  );
};
