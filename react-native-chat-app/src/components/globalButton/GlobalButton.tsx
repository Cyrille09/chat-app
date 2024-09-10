import React from "react";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native-ui-lib";

// style components
import CustomIcon from "../icon/Icon";
import buttonStyles from "./buttonStyles";
import { Colors } from "@/src/constants/Colors";

interface ButtonProps {
  name: string;
  type?: string;
  size?: string;
  leftIcon?: any;
  rightIcon?: any;
  sizeIcon?: number;
  disabled?: boolean;
  styles?: {};
  style?: {};
  testID?: string;
  onPress?: (value: any) => void;
}

export function GlobalButton({
  name,
  type,
  size,
  leftIcon,
  rightIcon,
  sizeIcon,
  styles,
  onPress,
  ...props
}: ButtonProps) {
  // disable font-scaling as this messes up the UI
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  function button() {
    if (type == "gradient-soft") {
      return (
        <LinearGradient
          colors={Colors.cyanGradientSoft}
          style={[
            buttonStyles.button,
            size == "small" && buttonStyles.small,
            styles,
          ]}
        >
          {leftIcon ? (
            <CustomIcon
              name={leftIcon}
              size={sizeIcon}
              style={buttonStyles.leftIcon}
            />
          ) : null}
          <Text
            style={[
              buttonStyles.text,
              size == "small" && buttonStyles.smallText,
            ]}
          >
            {name}
          </Text>
          {rightIcon ? (
            <CustomIcon
              name={rightIcon}
              size={sizeIcon}
              style={buttonStyles.rightIcon}
            />
          ) : null}
        </LinearGradient>
      );
    } else if (type == "gradient-hard") {
      return (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={Colors.cyanGradient}
          style={[
            buttonStyles.button,
            size == "small" && buttonStyles.small,
            styles,
          ]}
        >
          {leftIcon ? (
            <CustomIcon
              name={leftIcon}
              size={sizeIcon}
              style={buttonStyles.leftIcon}
            />
          ) : null}
          <Text
            style={[
              buttonStyles.text,
              size == "small" && buttonStyles.smallText,
            ]}
          >
            {name}
          </Text>
          {rightIcon ? (
            <CustomIcon
              name={rightIcon}
              size={sizeIcon}
              style={buttonStyles.rightIcon}
            />
          ) : null}
        </LinearGradient>
      );
    } else {
      return (
        <View
          style={[
            buttonStyles.button,
            size == "small" && buttonStyles.small,
            type == "grey" && buttonStyles.grey,
            type == "grey-outline" && buttonStyles.greyOutline,
            type == "success" && buttonStyles.success,
            styles,
          ]}
        >
          {leftIcon ? (
            <CustomIcon
              name={leftIcon}
              size={sizeIcon}
              style={buttonStyles.leftIcon}
            />
          ) : null}
          <Text
            style={[
              buttonStyles.text,
              size == "small" && buttonStyles.smallText,
            ]}
          >
            {name}
          </Text>
          {rightIcon ? (
            <CustomIcon
              name={rightIcon}
              size={sizeIcon}
              style={buttonStyles.rightIcon}
            />
          ) : null}
        </View>
      );
    }
  }

  return (
    <View style={buttonStyles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} {...props}>
        {button()}
      </TouchableOpacity>
    </View>
  );
}
