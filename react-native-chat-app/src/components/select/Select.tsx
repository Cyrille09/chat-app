import React from "react";
import { useField } from "formik";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";

interface SelectProps {
  items: any[];
  value?: string | number | Date | null;
  onValueChange: (value: {}, itemIndex: number) => void;
  itemKey?: string | number;
  placeholder?: { label: string; value: string };
  required?: boolean;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
}

export function ReactNativeSelect({
  items,
  onValueChange,
  value,
  itemKey,
  placeholder,
  name = "",
  id,
  label,
  disabled,
  required,
}: SelectProps) {
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <View style={[styles.field]}>
      {label && (
        <Text style={styles.label}>
          {label} {""} {required && <Text style={{ color: "red" }}>*</Text>}
        </Text>
      )}

      <View style={styles.picker}>
        <RNPickerSelect
          {...field}
          value={value}
          onValueChange={onValueChange}
          items={items}
          disabled={disabled}
          placeholder={placeholder}
          itemKey={itemKey}
        />
      </View>

      {isInvalid && <Text style={styles.error}>{meta.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
  },
  field: {
    marginBottom: 24,
  },
  lastChild: {
    marginBottom: 0,
  },
  label: {
    display: "flex", // 'flex' is used instead of 'block' in React Native
    marginBottom: 5,
  },
  error: {
    display: "flex", // 'flex' is used instead of 'block' in React Native
    width: "100%",
    marginTop: 4, // 0.25rem in CSS is equivalent to 4 in React Native (assuming 1rem = 16px)
    fontSize: 14, // 0.875em in CSS is approximately 14px
    color: "red", // Replace `$danger` with the actual color value
  },
});
