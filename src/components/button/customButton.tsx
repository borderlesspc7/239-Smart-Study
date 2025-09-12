import { StyleSheet, TouchableOpacity, Text } from "react-native";

export const CustomButton = (props: {
  type: "primary" | "secondary";
  isDisabled?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  text: string;
}) => {
  const { onPress, onLongPress, type, isDisabled } = props;
  const text = props.text;
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        type === "primary" ? styles.button : styles.buttonSecondary,
        isDisabled && styles.disabled,
      ]}
      disabled={isDisabled}
    >
      <Text
        style={
          type === "primary" ? styles.buttonText : styles.buttonTextSecondary
        }
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E53E3E",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#E53E3E",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#E53E3E",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
