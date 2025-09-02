import { TouchableOpacity, Text } from "react-native";

export default function Button({ title, onPress, className }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-blue-600 rounded-lg py-3 px-4 items-center ${className}`}
    >
      <Text className="text-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
