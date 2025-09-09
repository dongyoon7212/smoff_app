// app/(auth)/verify-email.tsx
import { sendVerifyEmailRequest, verifyEmailRequest } from "@/apis/mailApis";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedText, ThemedView } from "@/theme/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	View,
} from "react-native";

export default function VerifyEmail() {
	const { role, email } = useLocalSearchParams<{
		role: string;
		email: string;
	}>();
	const router = useRouter();
	const { theme } = useTheme();

	const [checking, setChecking] = useState(false); // 프라이머리 버튼 로딩
	const [resending, setResending] = useState(false); // 재전송 버튼 로딩
	const [requested, setRequested] = useState(false); // 인증 요청 성공 여부

	// 1) 인증 요청: 완료될 때까지 스피너 노출, 성공 시 requested=true → 버튼 라벨 전환
	const onRequest = async () => {
		try {
			setChecking(true);
			const response = await sendVerifyEmailRequest({ email });
			if (response.status === "success") {
				setRequested(true);
				Alert.alert(
					"요청 완료",
					"인증 메일을 보냈습니다. 메일함을 확인해 주세요."
				);
			} else {
				Alert.alert("오류", response.message);
			}
		} catch (e) {
			Alert.alert("오류", "인증 요청 중 문제가 발생했습니다.");
		} finally {
			setChecking(false);
		}
	};

	// 2) 인증 확인
	const onCheck = async () => {
		try {
			setChecking(true);
			const response = await verifyEmailRequest(email);
			if (response.status === "success") {
				Alert.alert("회원가입 완료", "이메일 인증이 확인되었습니다.", [
					{
						text: "확인",
						onPress: () => router.replace("/(tabs)/login"),
					},
				]);
			} else {
				Alert.alert(
					"인증 필요",
					"아직 인증되지 않았습니다. 메일의 링크를 눌러 주세요."
				);
			}
		} catch {
			Alert.alert("오류", "인증 상태를 확인하는 중 문제가 발생했습니다.");
		} finally {
			setChecking(false);
		}
	};

	// 3) 인증 메일 재전송: 요청 이후에만 표시. 진행 중엔 스피너
	const onResend = async () => {
		try {
			setResending(true);
			const response = await sendVerifyEmailRequest({ email });
			if (response.status === "success") {
				setRequested(true);
				Alert.alert("재전송 완료", "인증 메일을 다시 보냈습니다.");
			} else {
				Alert.alert("오류", response.message);
			}
		} catch {
			Alert.alert("오류", "재전송 중 문제가 발생했습니다.");
		} finally {
			setResending(false);
		}
	};

	const primaryLabel = requested ? "인증 확인" : "인증 요청";
	const primaryHandler = requested ? onCheck : onRequest;

	return (
		<ThemedView style={[styles.container, { backgroundColor: theme.bg }]}>
			<View style={styles.content}>
				<ThemedText style={styles.title}>
					이메일 인증 후 가입이 완료됩니다.
				</ThemedText>

				{!!email && (
					<ThemedText style={styles.emailText}>
						이메일:{" "}
						<ThemedText style={{ fontWeight: "700" }}>
							{email}
						</ThemedText>
					</ThemedText>
				)}

				<ThemedText style={styles.subtitle} muted>
					{requested
						? "메일의 인증 링크를 눌렀다면 아래 ‘인증 확인’을 눌러 상태를 확인하세요."
						: "‘인증 요청’을 누르면 인증 메일을 보냅니다."}
				</ThemedText>

				{/* 프라이머리: 요청 중/확인 중엔 스피너, 완료되면 라벨/동작 전환 */}
				<Pressable
					onPress={primaryHandler}
					disabled={checking}
					style={({ pressed }) => [
						styles.primaryBtn,
						{
							backgroundColor: theme.text,
							opacity: checking || pressed ? 0.7 : 1,
						},
					]}
					accessibilityRole="button"
				>
					{checking ? (
						<ActivityIndicator color={theme.bg} />
					) : (
						<ThemedText
							style={[styles.primaryBtnText, { color: theme.bg }]}
						>
							{primaryLabel}
						</ThemedText>
					)}
				</Pressable>

				{/* 재전송: 최초엔 숨김, requested=true가 된 후 표시 */}
				{requested && (
					<Pressable
						onPress={onResend}
						disabled={resending}
						style={({ pressed }) => [
							styles.secondaryBtn,
							{
								borderColor: theme.border,
								backgroundColor: theme.card,
								opacity: resending || pressed ? 0.7 : 1,
							},
						]}
						accessibilityRole="button"
					>
						{resending ? (
							<ActivityIndicator />
						) : (
							<ThemedText
								style={[
									styles.secondaryBtnText,
									{ color: theme.bg },
								]}
							>
								인증 메일 재전송
							</ThemedText>
						)}
					</Pressable>
				)}
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, justifyContent: "center" },
	content: { gap: 12, alignItems: "center" },
	title: { fontSize: 18, fontWeight: "700", textAlign: "center" },
	emailText: { fontSize: 14, marginTop: 2, textAlign: "center" },
	subtitle: { textAlign: "center" },
	primaryBtn: {
		marginTop: 16,
		paddingVertical: 14,
		paddingHorizontal: 18,
		borderRadius: 12,
		alignItems: "center",
		alignSelf: "stretch",
	},
	primaryBtnText: { fontWeight: "700", fontSize: 16 },
	secondaryBtn: {
		marginTop: 8,
		paddingVertical: 12,
		paddingHorizontal: 18,
		borderRadius: 12,
		alignItems: "center",
		alignSelf: "stretch",
		borderWidth: 1,
	},
	secondaryBtnText: { fontWeight: "600" },
});
