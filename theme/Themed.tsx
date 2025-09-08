import React from "react";
import {
	Text as RNText,
	TextInput as RNTextInput,
	View as RNView,
	TextInputProps,
	TextProps,
	ViewProps,
} from "react-native";
import { useTheme } from "./ThemeProvider";

export function ThemedView(props: ViewProps) {
	const { theme } = useTheme();
	return (
		<RNView
			{...props}
			style={[{ backgroundColor: theme.bg }, props.style]}
		/>
	);
}

export function ThemedCard(props: ViewProps) {
	const { theme } = useTheme();
	return (
		<RNView
			{...props}
			style={[
				{
					backgroundColor: theme.card,
					borderColor: theme.border,
					borderWidth: 1,
				},
				props.style,
			]}
		/>
	);
}

export function ThemedText(props: TextProps & { muted?: boolean }) {
	const { theme } = useTheme();
	const color = props.muted ? theme.mutedText : theme.text;
	return <RNText {...props} style={[{ color }, props.style]} />;
}

export function ThemedInput(props: TextInputProps) {
	const { theme } = useTheme();
	return (
		<RNTextInput
			{...props}
			style={[
				{
					color: theme.text,
					backgroundColor: theme.inputBg,
					borderColor: theme.border,
					borderWidth: 1,
					borderRadius: 8,
					paddingVertical: 15,
					paddingHorizontal: 12,
				},
				props.style,
			]}
			placeholderTextColor={theme.placeholder}
			// iOS 키보드 컬러 (가독성 향상)
			keyboardAppearance={theme.mode === "dark" ? "dark" : "light"}
		/>
	);
}
