// app/(tabs)/savings.tsx
import { Text, View } from "react-native";
export default function Savings() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 6,
			}}
		>
			<Text>누적 절약 금액 (UI만)</Text>
			<Text style={{ fontSize: 20, fontWeight: "700" }}>0 원</Text>
		</View>
	);
}
