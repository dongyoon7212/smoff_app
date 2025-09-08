// app/(auth)/signup-profile.tsx
import { signupRequest, usernameCheckRequest } from "@/apis/authApis";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedInput, ThemedText, ThemedView } from "@/theme/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

export default function SignUpProfile() {
	const { role, email, password } = useLocalSearchParams<{
		role: string;
		email: string;
		password: string;
	}>();
	const router = useRouter();
	const { theme } = useTheme();
	const profileImgUrl =
		"https://play-lh.googleusercontent.com/38AGKCqmbjZ9OuWx4YjssAz3Y0DTWbiM5HB0ove1pNBq_o9mtWfGszjZNxZdwt_vgHo";

	const [username, setUsername] = useState("");
	const [age, setAge] = useState(""); // ✅ 나이 입력 상태
	const [nameErr, setNameErr] = useState<string | null>(null);
	const [ageErr, setAgeErr] = useState<string | null>(null);

	const validate = () => {
		let nErr: string | null = null;
		let aErr: string | null = null;

		if (!username.trim()) nErr = "사용자 이름을 입력하세요.";
		const num = Number(age);
		if (!age) aErr = "나이를 입력하세요.";
		else if (!/^\d+$/.test(age)) aErr = "숫자만 입력하세요.";
		else if (num < 1 || num > 120) aErr = "나이는 1~120 사이여야 합니다.";

		setNameErr(nErr);
		setAgeErr(aErr);
		return !nErr && !aErr;
	};

	const onSubmit = () => {
		if (!validate()) return;
		// TODO: /auth/signup 연동 후 성공 시 아래로 이동
		usernameCheckRequest(username).then((response) => {
			if (response.status === "success") {
				signupRequest({
					email,
					password,
					username,
					roleType: role,
					age: Number(age),
					profileImg: profileImgUrl,
				}).then((response) => {
					if (response.status === "success") {
						router.replace({
							pathname: "/(auth)/verify-email",
							params: { email }, // ✅ age도 함께 전달(선택)
						});
					} else {
						Alert.alert(response.message);
						return;
					}
				});
			} else {
				Alert.alert(response.message);
				return;
			}
		});
	};

	const nameBorder = useMemo(
		() => (nameErr ? { borderColor: "#EF4444" } : null),
		[nameErr]
	);
	const ageBorder = useMemo(
		() => (ageErr ? { borderColor: "#EF4444" } : null),
		[ageErr]
	);

	return (
		<ThemedView style={[styles.container, { backgroundColor: theme.bg }]}>
			<View style={styles.content}>
				<ThemedText style={styles.caption}>
					{role} / {email}
				</ThemedText>

				{/* 사용자 이름 */}
				<ThemedInput
					placeholder="사용자 이름"
					value={username}
					onChangeText={(v) => {
						setUsername(v);
						if (nameErr) setNameErr(null);
					}}
					onBlur={() =>
						!username.trim() &&
						setNameErr("사용자 이름을 입력하세요.")
					}
					style={[styles.input, nameBorder]}
					returnKeyType="next"
					underlineColorAndroid="transparent"
				/>
				{!!nameErr && (
					<ThemedText style={[styles.errText, { color: "#EF4444" }]}>
						{nameErr}
					</ThemedText>
				)}

				{/* ✅ 나이 */}
				<ThemedInput
					placeholder="나이 (숫자만)"
					value={age}
					onChangeText={(v) => {
						// 숫자 외 입력 최소화(선택): 공백/문자 제거
						const onlyNum = v.replace(/[^\d]/g, "");
						setAge(onlyNum);
						if (ageErr) setAgeErr(null);
					}}
					onBlur={() => {
						const num = Number(age);
						if (!age) setAgeErr("나이를 입력하세요.");
						else if (!/^\d+$/.test(age))
							setAgeErr("숫자만 입력하세요.");
						else if (num < 1 || num > 120)
							setAgeErr("나이는 1~120 사이여야 합니다.");
					}}
					style={[styles.input, ageBorder]}
					keyboardType="number-pad"
					maxLength={3}
					underlineColorAndroid="transparent"
					returnKeyType="done"
				/>
				{!!ageErr && (
					<ThemedText style={[styles.errText, { color: "#EF4444" }]}>
						{ageErr}
					</ThemedText>
				)}

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
	errText: { fontSize: 12, marginTop: 4 },
	primaryBtn: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 8,
	},
	primaryBtnText: { fontWeight: "700", fontSize: 16 },
});
