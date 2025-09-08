// app/supporter/link.tsx
import { useState } from "react";
import { FlatList, SafeAreaView, Text, TextInput, View } from "react-native";
export default function SupporterLink() {
	const [q, setQ] = useState("");
	return (
		<SafeAreaView>
			<View style={{ flex: 1, padding: 16 }}>
				<Text
					style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}
				>
					챌린저 검색
				</Text>
				<TextInput
					placeholder="닉네임 검색"
					value={q}
					onChangeText={setQ}
					style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
				/>
				<FlatList
					style={{ marginTop: 12 }}
					data={[]}
					keyExtractor={(i, idx) => String(idx)}
					renderItem={() => <Text>검색 결과 없음 (UI만)</Text>}
				/>
			</View>
		</SafeAreaView>
	);
}
