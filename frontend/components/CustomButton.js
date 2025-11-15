// client/components/CustomButton.js
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

export default function CustomButton({
  title,
  onPress,
  icon,
  loading = false,
  disabled = false,
  style = {},
  textStyle = {},
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled ? "#ccc" : "#4F46E5",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        ...style,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "600",
              ...textStyle,
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
