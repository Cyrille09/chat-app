import React, { useEffect } from "react";
import { View, Text } from "react-native";

// style components
import alertStyles from "./alertStyles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux-toolkit/store";
import {
  errorPopupActions,
  successPopupActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";

interface AlertProps {
  type: string;
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  //  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  const actions = useSelector((state: RootState) => state.actionsSlice);
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(errorPopupActions({ status: false, message: "", display: "" }));
      dispatch(
        successPopupActions({ status: false, message: "", display: "" })
      );
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  return (
    <View
      style={[
        alertStyles.container,
        type == "error" && alertStyles.error,
        type == "warning" && alertStyles.warning,
        type == "success" && alertStyles.success,
      ]}
    >
      <Text
        style={[alertStyles.message, type == "warning" && alertStyles.dark]}
      >
        {message}
      </Text>
    </View>
  );
}
