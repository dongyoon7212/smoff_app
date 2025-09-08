// app/(tabs)/index.tsx
import { Link } from "expo-router";
import { Button, Text, View } from "react-native";
export default function Home() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 12,
			}}
		>
			<Text style={{ fontSize: 22, fontWeight: "700" }}>홈</Text>
			<Button title="참기 (예시)" onPress={() => {}} />
			<Link href="/supporter/link">서포터: 챌린저 검색</Link>
		</View>
	);
}
