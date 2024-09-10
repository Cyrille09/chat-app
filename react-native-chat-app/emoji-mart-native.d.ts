declare module "emoji-mart-native" {
  import React from "react";

  type EmojiData = {
    id: string;
    name: string;
    colons: string;
    native: string;
    skin?: number;
    unified: string;
    custom: boolean;
  };

  interface PickerProps {
    onSelect: (emoji: EmojiData) => void;
    onPressClose?: (value: {}) => void;
    title?: string;
    emoji?: string;
    color?: string;
    showPreview?: boolean;
    showSkinTones?: boolean;
    native?: boolean;
    set?: "apple" | "google" | "twitter" | "facebook";
    theme?: "light" | "dark";
    style?: React.CSSProperties;
    emojiSize?: number;
    perLine?: number;
    i18n?: Record<string, any>;
  }

  export class Picker extends React.Component<PickerProps> {}
}
