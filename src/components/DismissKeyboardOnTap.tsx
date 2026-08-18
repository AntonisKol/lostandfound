import { ReactElement } from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

// On web there's no on-screen keyboard to dismiss, and wrapping the whole
// form in a press handler here also intercepts taps meant for nested
// TextInputs, breaking focus. Skip the wrapper there; native negotiates
// the touch responder correctly so TouchableWithoutFeedback is safe.
const DismissKeyboardOnTap = ({ children }: { children: ReactElement }) => {
  if (Platform.OS === "web") return children;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardOnTap;
