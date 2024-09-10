import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Dialog, Icon } from "@rneui/themed";
import styles from "./modalStyles";
import { Divider } from "@rneui/base";
import React from "react";

// style components
interface ModalProps {
  size?: "sm" | "lg" | "xl";
  backdrop?: "static" | true | false;
  centered?: true | false;
  scrollable?: true | false;
  fullscreen?:
    | true
    | "sm-down"
    | "md-down"
    | "lg-down"
    | "xl-down"
    | "xxl-down";
  footer?: any;
  title?: string;
  show: boolean;
  handleClose: () => void;
  className?: any;
  titleClassName?: any;
  children: React.ReactNode;
}

export const GlobalModals = ({
  size,
  backdrop = true,
  centered = true,
  scrollable = false,
  fullscreen,
  title,
  show,
  handleClose,
  className,
  titleClassName,
  children,
}: ModalProps) => {
  return (
    <>
      <Dialog
        isVisible={show}
        onBackdropPress={handleClose}
        style={{ margin: 0, padding: 0 }}
      >
        <Dialog.Title title={title} />
        <Divider />
        <>{children}</>
      </Dialog>
    </>
  );
};

export const GlobalModal = ({
  size,
  backdrop = true,
  centered = true,
  scrollable = false,
  fullscreen,
  title,
  show,
  handleClose,
  className,
  titleClassName,
  children,
}: ModalProps) => {
  return (
    <>
      {show && (
        <ScrollView style={[styles.centeredView]}>
          <View>
            <View style={styles.modalRow}>
              <View style={styles.modalTitle}>
                <Text style={styles.modalTitleText}>{title}</Text>
              </View>
              <View style={styles.modalClose}>
                <Icon
                  type="font-awesome"
                  name="close"
                  size={25}
                  onPress={handleClose}
                />
              </View>
            </View>
            <Divider />
            <View>{children}</View>
          </View>
        </ScrollView>
      )}
    </>
  );
};
