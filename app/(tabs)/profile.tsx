import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function ProfileScreen() {
	return (
		<SafeAreaView>
			<Text>프로필</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: "#808080",
		bottom: -90,
		left: -35,
		position: "absolute",
	},
	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},
});
