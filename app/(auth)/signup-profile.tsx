// app/(auth)/signup-profile.tsx
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedInput, ThemedText, ThemedView } from "@/theme/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
// (선택) 레이아웃 헤더 대신 화면 상단에 직접 두고 싶으면 사용
// import StepHeader from "@/components/StepHeader";

export default function SignUpProfile() {
	const { role, email, password } = useLocalSearchParams<{
		role: string;
		email: string;
		password: string;
	}>();
	const router = useRouter();
	const { theme } = useTheme();

	const [username, setUsername] = useState("");

	const onSubmit = () => {
		// TODO: /auth/signup 연동 후 성공 시 아래로 이동
		router.replace({
			pathname: "/(auth)/verify-email",
			params: { role, email, password },
		});
	};

	return (
		<ThemedView style={[styles.container, { backgroundColor: theme.bg }]}>
			{/* <StepHeader current={3} total={3} title="사용자 이름" /> */}

			<View style={styles.content}>
				<ThemedText style={styles.caption}>
					{role} / {email}
				</ThemedText>

				<ThemedInput
					placeholder="사용자 이름"
					value={username}
					onChangeText={setUsername}
					style={styles.input}
					returnKeyType="done"
				/>

				<Pressable
					onPress={onSubmit}
					hitSlop={12}
					accessibilityRole="button"
					accessibilityLabel="회원가입 완료"
					style={[styles.primaryBtn, { backgroundColor: theme.text }]}
				>
					<ThemedText
						style={[styles.primaryBtnText, { color: theme.bg }]}
					>
						회원가입
					</ThemedText>
				</Pressable>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: 20, gap: 12 },
	caption: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
	input: { borderRadius: 10 },
	primaryBtn: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 8,
	},
	primaryBtnText: { fontWeight: "700", fontSize: 16 },
});
