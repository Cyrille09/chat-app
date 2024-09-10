import { View } from "react-native";
import boxShadowCardStyles from "./boxShadowCardStyles";
import React from "react";

export const BoxShadowCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: any;
}) => {
  return (
    <View style={boxShadowCardStyles.boxShadowMain}>
      <View>{children}</View>
    </View>
  );
};
