import { changePasswordRequest } from "@/apis/accountApis";
import { useAuth } from "@/stores/useAuth";
import { ThemedInput, ThemedText, ThemedView } from "@/theme/Themed";
import { useTheme } from "@/theme/ThemeProvider";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 8~16자, 영문자+숫자+특수문자 1개 이상 (공백 불가)
const PW_RE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,16}$/;

export default function ChangePasswordScreen() {
	const { theme } = useTheme();
	const user = useAuth((s) => s.user);
	const clearAuth = useAuth((s) => s.clearAuth);

	const [cur, setCur] = useState("");
	const [nw, setNw] = useState("");
	const [cf, setCf] = useState("");
	const [showCur, setShowCur] = useState(false);
	const [showNw, setShowNw] = useState(false);
	const [showCf, setShowCf] = useState(false);
	const [touched, setTouched] = useState({
		cur: false,
		nw: false,
		cf: false,
	});

	const curErr = useMemo(() => {
		if (!touched.cur) return "";
		if (!cur.trim()) return "현재 비밀번호를 입력하세요.";
		return "";
	}, [cur, touched.cur]);

	const nwErr = useMemo(() => {
		if (!touched.nw) return "";
		if (!nw.trim()) return "새 비밀번호를 입력하세요.";
		if (!PW_RE.test(nw))
			return "8~16자, 영문자·숫자·특수문자를 포함해야 합니다.";
		if (nw === cur) return "현재 비밀번호와 다르게 설정하세요.";
		return "";
	}, [nw, cur, touched.nw]);

	const cfErr = useMemo(() => {
		if (!touched.cf) return "";
		if (cf !== nw) return "비밀번호가 일치하지 않습니다.";
		return "";
	}, [cf, nw, touched.cf]);

	const hasError = !!(curErr || nwErr || cfErr);

	const m = useMutation({
		mutationFn: changePasswordRequest,
		onSuccess: async (resp) => {
			if (resp.status !== "success") {
				await Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Error
				);
				Alert.alert("변경 실패", resp.message);
				return;
			}
			await Haptics.notificationAsync(
				Haptics.NotificationFeedbackType.Success
			);
			Alert.alert(
				"완료",
				"비밀번호가 변경되었습니다. 다시 로그인해 주세요.",
				[
					{
						text: "확인",
						onPress: () => {
							clearAuth(); // 보안상 로그아웃 권장
							router.replace("/(tabs)/login");
						},
					},
				]
			);
		},
		onError: async () => {
			await Haptics.notificationAsync(
				Haptics.NotificationFeedbackType.Error
			);
			Alert.alert("오류", "변경 중 문제가 발생했습니다.");
		},
	});

	const submit = () => {
		// 포커스 아웃 처리
		setTouched({ cur: true, nw: true, cf: true });
		if (hasError) return;
		m.mutate({
			userId: Number(user?.userId),
			oldPassword: cur,
			newPassword: nw,
		});
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.bg }}
			edges={["top", "left", "right"]}
		>
			<ThemedView
				style={[styles.container, { backgroundColor: theme.bg }]}
			>
				<View style={styles.header}>
					<ThemedText style={styles.title}>비밀번호 변경</ThemedText>
					<ThemedText muted>
						8~16자, 영문자·숫자·특수문자 포함
					</ThemedText>
				</View>

				{/* 현재 비밀번호 */}
				<View>
					<ThemedInput
						placeholder="현재 비밀번호"
						value={cur}
						onChangeText={setCur}
						onBlur={() => setTouched((t) => ({ ...t, cur: true }))}
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={!showCur} // 비밀번호 가리기
						textContentType="password" // iOS 힌트
						style={[styles.input, !!curErr && styles.errBorder]}
						placeholderTextColor="#9CA3AF"
					/>
					{!!curErr && (
						<ThemedText style={styles.error}>{curErr}</ThemedText>
					)}
					<Pressable
						style={styles.eye}
						onPress={() => setShowCur((v) => !v)}
					>
						<ThemedText muted>
							{showCur ? "가리기" : "표시"}
						</ThemedText>
					</Pressable>
				</View>

				{/* 새 비밀번호 */}
				<View>
					<ThemedInput
						placeholder="새 비밀번호"
						value={nw}
						onChangeText={setNw}
						onBlur={() => setTouched((t) => ({ ...t, nw: true }))}
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={!showNw}
						textContentType="newPassword" // iOS 새 비번 힌트
						style={[styles.input, !!nwErr && styles.errBorder]}
						placeholderTextColor="#9CA3AF"
					/>
					{!!nwErr && (
						<ThemedText style={styles.error}>{nwErr}</ThemedText>
					)}
					<Pressable
						style={styles.eye}
						onPress={() => setShowNw((v) => !v)}
					>
						<ThemedText muted>
							{showNw ? "가리기" : "표시"}
						</ThemedText>
					</Pressable>
				</View>

				{/* 새 비밀번호 확인 */}
				<View>
					<ThemedInput
						placeholder="새 비밀번호 확인"
						value={cf}
						onChangeText={setCf}
						onBlur={() => setTouched((t) => ({ ...t, cf: true }))}
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={!showCf}
						style={[styles.input, !!cfErr && styles.errBorder]}
						placeholderTextColor="#9CA3AF"
					/>
					{!!cfErr && (
						<ThemedText style={styles.error}>{cfErr}</ThemedText>
					)}
					<Pressable
						style={styles.eye}
						onPress={() => setShowCf((v) => !v)}
					>
						<ThemedText muted>
							{showCf ? "가리기" : "표시"}
						</ThemedText>
					</Pressable>
				</View>

				<Pressable
					onPress={submit}
					disabled={m.isPending || hasError}
					style={[
						styles.primaryBtn,
						{
							backgroundColor: theme.primary,
							opacity: m.isPending || hasError ? 0.6 : 1,
						},
					]}
				>
					{m.isPending ? (
						<ActivityIndicator />
					) : (
						<ThemedText
							style={[
								styles.primaryBtnText,
								{ color: theme.btnText },
							]}
						>
							저장
						</ThemedText>
					)}
				</Pressable>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 14 },
	header: { marginBottom: 4 },
	title: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
	input: { borderRadius: 10, paddingRight: 64 }, // 눈 버튼 공간
	errBorder: { borderColor: "#ef4444" },
	error: { color: "#ef4444", marginTop: 4 },
	eye: { position: "absolute", right: 12, top: 14, padding: 6 },
	primaryBtn: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 4,
	},
	primaryBtnText: { fontWeight: "700", fontSize: 16 },
});
