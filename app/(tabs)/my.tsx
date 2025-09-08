// app/(tabs)/my.tsx
import { Text, View } from "react-native";
export default function My() {
	return (
		<View
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
		>
			<Text>마이페이지 (연결/프로필 UI만)</Text>
		</View>
	);
}
