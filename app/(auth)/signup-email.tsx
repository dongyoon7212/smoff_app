// app/(auth)/signup-email.tsx
import { emailCheckRequest } from "@/apis/authApis";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedInput, ThemedText, ThemedView } from "@/theme/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

// 합리적인 이메일 패턴 (대소문자 무시)
// - local: 영문/숫자/._%+-
// - @
// - domain: 영문/숫자/.-
// - TLD: 2+ letters
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i; // MDN/합리적 패턴 참조 :contentReference[oaicite:3]{index=3}

// 비밀번호: 8~16자, 영문/숫자/특수문자 각각 최소 1개
// 특수문자 집합은 필요 시 확장 가능
const PW_RE =
	/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,16}$/;

export default function SignUpEmail() {
	const { role } = useLocalSearchParams<{ role: string }>();
	const router = useRouter();
	const { theme } = useTheme();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// 에러 메시지 상태
	const [emailErr, setEmailErr] = useState<string | null>(null);
	const [pwErr, setPwErr] = useState<string | null>(null);

	// 실시간(blur/onChange 시) 간단 체크: 입력 중에는 가벼운 힌트만, 제출 시엔 강제 검사
	const validateEmail = (value: string) => {
		if (!value) return "이메일을 입력하세요.";
		if (!EMAIL_RE.test(value)) return "올바른 이메일 형식이 아닙니다.";
		return null;
	};

	const validatePassword = (value: string) => {
		if (!value) return "비밀번호를 입력하세요.";
		if (value.length < 8 || value.length > 16)
			return "비밀번호는 8~16자여야 합니다.";
		if (!PW_RE.test(value))
			return "영문자, 숫자, 특수문자를 모두 포함해야 합니다.";
		return null;
	};

	const onNext = () => {
		const eErr = validateEmail(email);
		const pErr = validatePassword(password);
		setEmailErr(eErr);
		setPwErr(pErr);
		if (eErr || pErr) return;

		emailCheckRequest(email).then((response) => {
			if (response.status === "success") {
				Alert.alert(response.message);
				router.push({
					pathname: "/(auth)/signup-profile",
					params: { role, email, password },
				});
			} else {
				Alert.alert(response.message);
				return;
			}
		});
	};

	// 에러 테두리 색
	const emailBorder = useMemo(
		() => (emailErr ? { borderColor: "#EF4444" } : null),
		[emailErr]
	);
	const pwBorder = useMemo(
		() => (pwErr ? { borderColor: "#EF4444" } : null),
		[pwErr]
	);

	return (
		<ThemedView style={[styles.container, { backgroundColor: theme.bg }]}>
			<View style={styles.content}>
				<ThemedText style={styles.roleLabel}>{role}</ThemedText>

				{/* 이메일 */}
				<ThemedInput
					placeholder="이메일"
					autoCapitalize="none"
					keyboardType="email-address"
					value={email}
					onChangeText={(v) => {
						setEmail(v);
						if (emailErr) setEmailErr(null); // 입력 중이면 에러 해제(원하면 blur에서만 검사)
					}}
					onBlur={() => setEmailErr(validateEmail(email))}
					style={[styles.input, emailBorder]}
					underlineColorAndroid="transparent" // Android 기본 언더라인 제거 :contentReference[oaicite:4]{index=4}
				/>
				{!!emailErr && (
					<ThemedText
						style={[styles.errorText, { color: "#EF4444" }]}
					>
						{emailErr}
					</ThemedText>
				)}

				{/* 비밀번호 */}
				<ThemedInput
					placeholder="비밀번호 (8~16자, 영문/숫자/특수문자 포함)"
					secureTextEntry
					value={password}
					onChangeText={(v) => {
						setPassword(v);
						if (pwErr) setPwErr(null);
					}}
					onBlur={() => setPwErr(validatePassword(password))}
					style={[styles.input, pwBorder]}
					underlineColorAndroid="transparent"
				/>
				{!!pwErr && (
					<ThemedText
						style={[styles.errorText, { color: "#EF4444" }]}
					>
						{pwErr}
					</ThemedText>
				)}

				<Pressable
					onPress={onNext}
					hitSlop={12}
					style={[styles.primaryBtn, { backgroundColor: theme.text }]}
					accessibilityRole="button"
					accessibilityLabel="다음 단계로 이동"
				>
					<ThemedText
						style={[styles.primaryBtnText, { color: theme.bg }]}
					>
						다음
					</ThemedText>
				</Pressable>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: 20, gap: 8 },
	roleLabel: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
	input: { borderRadius: 10 },
	errorText: { fontSize: 12, marginTop: 4 },
	primaryBtn: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 12,
	},
	primaryBtnText: { fontWeight: "700", fontSize: 16 },
});
