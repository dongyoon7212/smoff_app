// app/(tabs)/login.tsx
import { signinRequest } from "@/apis/authApis";
import { useAuth } from "@/stores/useAuth";
import { ThemedInput, ThemedText, ThemedView } from "@/theme/Themed";
import { useTheme } from "@/theme/ThemeProvider";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Platform,
	PlatformColor,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function LoginScreen() {
	const iosPlaceholder =
		Platform.OS === "ios" ? PlatformColor("placeholderText") : "#9CA3AF";
	const { theme } = useTheme();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signinMutation = useMutation({
		mutationFn: signinRequest,
		mutationKey: ["signin"],
		onSuccess: (response) => {
			if (response.status === "success") {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success
				);
				useAuth
					.getState()
					.setAuth(response.data.accessToken, response.data.user);
				router.replace("/(tabs)");
			} else {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Error
				);
				Alert.alert("오류", response.message);
				return;
			}
		},
	});

	const onLogin = () => {
		if (!email || !password) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert("오류", "이메일과 비밀번호를 모두 입력하세요.");
			return;
		}

		signinMutation.mutate({ email, password });
	};

	return (
		<ThemedView style={[styles.container, { backgroundColor: theme.bg }]}>
			<ThemedText style={styles.title}>로그인</ThemedText>

			<ThemedInput
				placeholder="이메일"
				autoCapitalize="none"
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
			/>
			<ThemedInput
				placeholder="비밀번호"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			<Pressable
				style={[styles.loginBtn, { backgroundColor: theme.primary }]}
				onPress={onLogin}
			>
				<ThemedText
					style={(styles.loginBtnText, { color: theme.btnText })}
				>
					로그인
				</ThemedText>
			</Pressable>

			<View style={styles.signupBox}>
				<Link href="/(auth)/role-select">
					<ThemedText style={styles.signupBtnText}>
						회원가입
					</ThemedText>
				</Link>
			</View>

			<View style={[styles.divider, { backgroundColor: theme.border }]} />
			<ThemedText muted style={styles.dividerText}>
				또는
			</ThemedText>

			{/* 구글 */}
			<Pressable
				onPress={() => {
					/* TODO: onGooglePress() */
				}}
				style={[styles.socialBtn, styles.socialBtnBorder]}
			>
				<Text style={styles.socialBtnText}>Google로 계속하기</Text>
			</Pressable>

			{/* 카카오 */}
			<Pressable
				onPress={() => {
					/* TODO: onKakaoPress() */
				}}
				style={[styles.socialBtn, styles.socialBtnKakao]}
			>
				<Text style={styles.socialBtnText}>카카오로 계속하기</Text>
			</Pressable>

			{/* 네이버 */}
			<Pressable
				onPress={() => {
					/* TODO: onNaverPress() */
				}}
				style={[styles.socialBtn, styles.socialBtnNaver]}
			>
				<Text
					style={[styles.socialBtnText, styles.socialBtnTextOnDark]}
				>
					네이버로 계속하기
				</Text>
			</Pressable>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		gap: 12,
		justifyContent: "center",
	},
	title: {
		fontSize: 40,
		fontWeight: "700",
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		paddingVertical: 15,
		paddingHorizontal: 12,
		borderRadius: 12,
		borderColor: "#ccc",
	},
	loginBtn: {
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 4,
	},
	loginBtnText: {
		color: "black",
		fontWeight: "700",
	},
	signupBox: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center", // ← 가로 중앙 정렬
		marginTop: 8,
	},
	signupBtn: {
		paddingVertical: 12, // ← 글자보다 충분히 크게
		paddingHorizontal: 16,
		alignItems: "center",
		alignSelf: "center", // ← 혹시 부모 정렬이 달라도 중앙에
	},
	signupBtnText: {
		textDecorationLine: "underline",
	},
	divider: {
		height: 1,
		backgroundColor: "#eee",
		marginVertical: 8,
	},
	dividerText: {
		textAlign: "center",
		color: "#666",
		marginBottom: 4,
	},
	socialBtn: {
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 8,
	},
	socialBtnBorder: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
	},
	socialBtnKakao: {
		backgroundColor: "#FEE500",
	},
	socialBtnNaver: {
		backgroundColor: "#03C75A",
	},
	socialBtnText: {
		fontWeight: "700",
	},
	socialBtnTextOnDark: {
		color: "white",
	},
});
