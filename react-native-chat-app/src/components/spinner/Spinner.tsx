import SpinnerOverlay from "react-native-loading-spinner-overlay";

// style components
import { Loading } from "../../components/loading/Loading";
import { Colors } from "@/src/constants/Colors";

interface SpinnerProps {
  visible: boolean;
  textContent: string;
}
export function Spinner({ visible, textContent }: SpinnerProps) {
  return (
    <>
      <SpinnerOverlay
        visible={visible}
        textContent={textContent}
        textStyle={{ color: Colors.white, fontSize: 18 }}
        animation="fade"
        overlayColor="rgba(0, 0, 0, 0.85)"
        customIndicator={<Loading />}
      />
    </>
  );
}
