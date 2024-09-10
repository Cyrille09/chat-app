import { Button, Input } from "@rneui/themed";

// https://reactnativeelements.com/docs/components/button#usage
interface ButtonProps {
  title: string;
  iconName?: string;
  iconType?: string;
  iconRight?: boolean;
  iconContainerStyle?: any;
  titleStyle?: any;
  color?: "primary" | "success" | "warning" | "error" | "secondary" | "string";
  size?: "sm" | "md" | "lg";
  containerStyle?: any;
  type?: "solid" | "clear" | "outline";
  uppercase?: boolean;
  disabled?: boolean;
  style?: any;
  borderRadius?: number;
  onPress?: (value: {}) => void;
}

export const ReactNativeElementsButtonWithIcon = ({
  title,
  iconName = "edit",
  iconType = "font-awesome",
  iconRight,
  iconContainerStyle,
  titleStyle,
  color = "primary",
  size = "md",
  containerStyle,
  type = "solid",
  uppercase,
  disabled,
  borderRadius = 10,
  onPress,
}: ButtonProps) => {
  // iconContainerStyle={{ marginLeft: 10 }}
  // titleStyle={{ fontWeight: "700" }}
  // buttonStyle={{
  //   backgroundColor: "rgba(199, 43, 98, 1)",
  //   borderColor: "transparent",
  //   borderWidth: 0,
  //   borderRadius: 10,
  // }}
  // containerStyle={{
  //   width: 200,
  //   marginHorizontal: 50,
  //   marginVertical: 10,
  // }}
  return (
    <>
      <Button
        onPress={onPress}
        title={title}
        icon={{
          name: iconName,
          type: iconType,
          size: 18,
          color: "white",
        }}
        color={color}
        iconRight={iconRight}
        iconContainerStyle={iconContainerStyle}
        titleStyle={titleStyle}
        size={size}
        buttonStyle={{
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: borderRadius,
        }}
        containerStyle={containerStyle}
        disabled={disabled}
        type={type}
        uppercase={uppercase}
      />
    </>
  );
};

export const ReactNativeElementsButton = ({
  title,
  iconContainerStyle,
  titleStyle,
  color = "primary",
  size = "md",
  containerStyle,
  type = "solid",
  uppercase,
  disabled,
  style,
  borderRadius = 10,
  onPress,
}: ButtonProps) => {
  return (
    <>
      <Button
        onPress={onPress}
        title={title}
        color={color}
        iconContainerStyle={iconContainerStyle}
        titleStyle={titleStyle}
        size={size}
        buttonStyle={{
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: borderRadius,
        }}
        containerStyle={containerStyle}
        disabled={disabled}
        type={type}
        uppercase={uppercase}
        style={style}
      />
    </>
  );
};

export const ReactNativeElementsInput = () => {
  return (
    <>
      <Input
        placeholder="INPUT WITH ERROR MESSAGE"
        errorStyle={{ color: "red" }}
        errorMessage="ENTER A VALID ERROR HERE"
      />
    </>
  );
};
