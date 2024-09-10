import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Text } from "react-native-ui-lib";
import { useField } from "formik";

// style components
import textInputStyles from "./textInputStyles";
import CustomIcon from "../icon/Icon";
import { Colors } from "@/src/constants/Colors";

interface TextInputProps {
  name: string;
  id?: string;
  autoCapitalize?: "characters" | "words" | "sentences" | "none";
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | "url";
  textContentType?:
    | "none"
    | "URL"
    | "addressCity"
    | "addressCityAndState"
    | "addressState"
    | "countryName"
    | "creditCardNumber"
    | "emailAddress"
    | "familyName"
    | "fullStreetAddress"
    | "givenName"
    | "jobTitle"
    | "location"
    | "middleName"
    | "name"
    | "namePrefix"
    | "nameSuffix"
    | "nickname"
    | "organizationName"
    | "postalCode"
    | "streetAddressLine1"
    | "streetAddressLine2"
    | "sublocality"
    | "telephoneNumber"
    | "username"
    | "password";
  maxLength?: number;
  autoCorrect?: boolean;
  touched?: {};
  editable?: boolean;
  error?: string;
  secureTextEntry?: boolean;
  placeholder: string;
  value?: string;
  rightIcon?: any;
  onBlur?: (value: {}) => void;
  errorContent?: string;
  placeholderTextColor?: string;
  onChangeText?: (value: any) => void;
  multiline?: boolean;
  numberOfLines?: number;
  rounded?: boolean;
  styles?: {};
  testID?: string;
  title?: string;
  onChange?: (value: {}) => void;
  onIconPress?: (value: {}) => void;
}
export function GlobalTextInput({
  name,
  autoCapitalize,
  keyboardType,
  textContentType,
  maxLength,
  autoCorrect,
  editable,
  secureTextEntry,
  placeholder,
  value,
  rightIcon,
  onBlur,
  onChangeText,
  onChange,
  multiline,
  numberOfLines,
  rounded,
  styles,
  title,
  onIconPress,
  ...props
}: TextInputProps) {
  const [field, meta, helpers] = useField(name);
  const isInvalid = meta.error && meta.touched;
  return (
    <View style={textInputStyles.container}>
      {title && <Text style={textInputStyles.title}>{title}</Text>}
      <View style={textInputStyles.group}>
        <TextInput
          allowFontScaling={false}
          secureTextEntry={secureTextEntry}
          style={[
            textInputStyles.input,
            isInvalid && textInputStyles.invalid,
            rightIcon && textInputStyles.rightIcon,
            rounded && textInputStyles.rounded,
            styles,
          ]}
          textContentType={textContentType}
          placeholder={placeholder}
          value={value}
          editable={editable}
          onBlur={onBlur}
          onChangeText={onChangeText}
          blurOnSubmit
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          keyboardAppearance={"dark"}
          maxLength={maxLength}
          autoCorrect={autoCorrect}
          placeholderTextColor={Colors.greyLight}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onChange={onChange}
        />
        <TouchableOpacity
          style={textInputStyles.iconLeft}
          onPress={onIconPress}
          {...props}
        >
          <CustomIcon style={textInputStyles.icon} name={rightIcon} size={20} />
        </TouchableOpacity>
      </View>
      {isInvalid && (
        <Text style={textInputStyles.errorMessage}>{meta.error}</Text>
      )}
    </View>
  );
}
