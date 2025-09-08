// app/(auth)/role-select.tsx
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
export default function RoleSelect() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 16,
			}}
		>
			<Text style={{ fontSize: 24, fontWeight: "700" }}>
				역할을 선택하세요
			</Text>
			<Link href="/(auth)/signup-email?role=CHALLENGER" asChild>
				<Pressable
					style={{ padding: 16, borderRadius: 12, borderWidth: 1 }}
				>
					<Text>Challenger</Text>
				</Pressable>
			</Link>
			<Link href="/(auth)/signup-email?role=SUPPORTER" asChild>
				<Pressable
					style={{ padding: 16, borderRadius: 12, borderWidth: 1 }}
				>
					<Text>Supporter</Text>
				</Pressable>
			</Link>
		</View>
	);
}
