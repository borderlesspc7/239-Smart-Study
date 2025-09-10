import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native";

export const CustomButton = (props: {
  type: "primary" | "secondary";
  isDisabled?: true;
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
      style={type === "primary" ? styles.button : styles.buttonSecondary}
      disabled={isDisabled}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 100,
  },
  buttonSecondary: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 100,
  },
});
