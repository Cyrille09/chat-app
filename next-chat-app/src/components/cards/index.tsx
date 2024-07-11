import classnames from "classnames";

import "./box-shadow-card.scss";

export const BoxShadowCard = ({
  children,
  className,
}: {
  children: any;
  className?: any;
}) => {
  return (
    <div className={classnames("box-shadow-main", className)}>
      <div>{children}</div>
    </div>
  );
};
