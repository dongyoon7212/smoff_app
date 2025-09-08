// app/challenger/pledge.tsx
import { Button, Text, View } from "react-native";
export default function Pledge() {
	return (
		<View style={{ flex: 1, padding: 20, gap: 12 }}>
			<Text style={{ fontSize: 18, fontWeight: "700" }}>금연 서약서</Text>
			<Text>- 서약 내용 UI -</Text>
			<Button title="서명 저장 (추가예정)" onPress={() => {}} />
		</View>
	);
}
