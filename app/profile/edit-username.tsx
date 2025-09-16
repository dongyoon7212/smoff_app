import { updateUsernameRequest } from "@/apis/accountApis";
import { useAuth } from "@/stores/useAuth";
import { ThemedInput, ThemedText, ThemedView } from "@/theme/Themed";
import { useTheme } from "@/theme/ThemeProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 간단 검증: 2~20자, 한글/영문/숫자/언더스코어/하이픈 허용
const USERNAME_RE = /^[\p{L}0-9_-]{2,20}$/u;

export default function EditUsernameScreen() {
	const { theme } = useTheme();
	const queryClient = useQueryClient();
	const user = useAuth((s) => s.user);
	const setUser = useAuth((s) => s.setUser); // zustand에 이런 setter가 없다면 만들어 주세요.

	const [value, setValue] = useState(user?.username ?? "");
	const [touched, setTouched] = useState(false);

	const error = useMemo(() => {
		if (!touched) return "";
		if (!value.trim()) return "사용자 이름을 입력하세요.";
		if (!USERNAME_RE.test(value.trim()))
			return "2~20자, 한글/영문/숫자/_, -만 가능합니다.";
		return "";
	}, [value, touched]);

	const m = useMutation({
		mutationFn: updateUsernameRequest,
		onSuccess: async (response) => {
			if (response.status !== "success") {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Error
				);
				Alert.alert("변경 실패", response.message);
				return;
			} else {
				// 1) 전역 유저 이름 즉시 갱신
				setUser({ ...(user as any), username: value.trim() });

				// 2) 선택: 관련 쿼리 무효화 (프로필/마이페이지 등)
				await queryClient.invalidateQueries({ queryKey: ["me"] });

				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success
				);
				Alert.alert("완료", response.message, [
					{ text: "확인", onPress: () => router.back() },
				]);
			}
		},
		onError: (error) => {
			console.log(error);
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert("오류", "변경 중 문제가 발생했습니다.");
		},
	});

	const onSubmit = () => {
		setTouched(true);
		if (error) return;
		m.mutate({ userId: Number(user?.userId), username: value.trim() });
	};

	// 편의: 최초 진입 시 기본값 없으면 터치 처리
	useEffect(() => {
		if (!value) setTouched(true);
	}, []);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.bg }}
			edges={["top", "left", "right"]} // 상단/좌우만 안전영역
		>
			<ThemedView
				style={[styles.container, { backgroundColor: theme.bg }]}
			>
				<View style={styles.header}>
					<ThemedText style={styles.title}>
						사용자 이름 변경
					</ThemedText>
					{/* <ThemedText muted>2~20자, 한글/영문/숫자/_, -</ThemedText> */}
				</View>

				<ThemedInput
					value={value}
					onChangeText={setValue}
					onBlur={() => setTouched(true)}
					placeholder="새 사용자 이름"
					autoCapitalize="none"
					style={[
						styles.input,
						!!error && { borderColor: "#ef4444" }, // 오류시 빨간 테두리
					]}
					placeholderTextColor={"#9CA3AF"} // RN TextInput props 참고 :contentReference[oaicite:3]{index=3}
				/>
				{!!error && (
					<ThemedText style={styles.errorText}>{error}</ThemedText>
				)}

				<Pressable
					onPress={onSubmit}
					disabled={m.isPending || !!error}
					style={[
						styles.primaryBtn,
						{
							backgroundColor: theme.primary,
							opacity: m.isPending || !!error ? 0.6 : 1,
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
	container: { flex: 1, padding: 20, gap: 12 },
	header: { marginBottom: 8 },
	title: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
	input: { borderRadius: 10 },
	errorText: { color: "#ef4444", marginTop: 4 },
	primaryBtn: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 8,
	},
	primaryBtnText: { fontWeight: "700", fontSize: 16 },
});
