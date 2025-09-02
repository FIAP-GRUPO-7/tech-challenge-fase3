import { TextInput, View, Text } from "react-native";

export default function Input({ label, ...props }) {
  return (
    <View className="w-full mb-4">
      {label && <Text className="mb-1 text-gray-700">{label}</Text>}
      <TextInput
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
        {...props}
      />
    </View>
  );
}
