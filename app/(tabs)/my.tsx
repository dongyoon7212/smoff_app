// app/(tabs)/my.tsx
import { useAuth } from "@/stores/useAuth";
import { ThemedCard, ThemedText, ThemedView } from "@/theme/Themed";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
	const { theme } = useTheme();
	const { clearAuth } = useAuth.getState();
	const user = useAuth((s) => s.user);
	const authed = useAuth((s) => !!s.accessToken);

	// 역할별 카운트 (TODO: 백엔드 데이터로 교체)
	const { counterpartLabel, counterpartCount } = useMemo(() => {
		if (user?.roleType === "CHALLENGER")
			return { counterpartLabel: "서포터", counterpartCount: 4 };
		if (user?.roleType === "SUPPORTER")
			return { counterpartLabel: "챌린저", counterpartCount: 2 };
		return { counterpartLabel: "연결", counterpartCount: 0 };
	}, [user?.roleType]);

	const [sheetVisible, setSheetVisible] = useState(false);

	const onLogout = async () => {
		setSheetVisible(false);
		// 실제로는 서버 로그아웃 호출이나 토큰 무효화가 있을 수 있음
		await clearAuth();
		router.replace("/(tabs)/login"); // 로그인 탭으로 이동 (탭 내 로그인 유지 전략)
	};

	const onChangePassword = () => {
		setSheetVisible(false);
		router.push("/profile/change-password");
		// router.push("/(tabs)/change-password") 등으로 연결
	};

	const onChangeProfileImage = () => {
		setSheetVisible(false);
		router.push("/profile/change-photo");
	};

	const onChangeUsername = () => {
		setSheetVisible(false);
		router.push("/profile/edit-username");
	};

	const profileUri =
		user?.profileImg ?? "https://placehold.co/160x160/png?text=Profile";

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.bg }}
			edges={["top", "left", "right"]} // 상단/좌우만 안전영역
		>
			<ThemedView
				style={[styles.container, { backgroundColor: theme.bg }]}
			>
				{/* 화면 내부 상단 우측 설정 버튼 */}
				<View style={styles.headerRow}>
					<View style={{ flex: 1 }} />
					<Pressable
						onPress={() => setSheetVisible(true)}
						hitSlop={10}
						style={[styles.iconBtn]}
						accessibilityRole="button"
						accessibilityLabel="설정 열기"
					>
						<Ionicons
							name="settings-outline"
							size={20}
							color={theme.text}
						/>
					</Pressable>
				</View>

				{/* 프로필 카드: 이미지 중앙 상단 → 이름 → 이메일 */}
				<ThemedCard
					style={[
						styles.card,
						{
							backgroundColor: "transparent",
							borderColor: "transparent",
						},
					]}
				>
					<View style={styles.profileBox}>
						<Image
							source={{ uri: profileUri }}
							style={styles.avatar}
						/>
						<ThemedText style={styles.name}>
							{user?.username ?? "게스트"}
						</ThemedText>
						<ThemedText muted style={styles.email}>
							{user?.email ?? "-"}
						</ThemedText>
					</View>
				</ThemedCard>
				{user?.roleType === "CHALLENGER" && (
					<Pressable
						onPress={() => router.push("/challenger/pledge-view")}
						hitSlop={10}
						style={[
							styles.bigBtn,
							{
								backgroundColor: theme.primary,
								borderColor: theme.border,
							},
						]}
					>
						<ThemedText
							style={[
								styles.bigBtnText,
								{ color: theme.btnText },
							]}
						>
							서약서 확인
						</ThemedText>
					</Pressable>
				)}

				{/* 역할 반대쪽 연결 버튼 */}
				<Pressable
					onPress={() => router.push("/supporter/link")}
					hitSlop={10}
					style={[
						styles.bigBtn,
						{
							backgroundColor: theme.primary,
							borderColor: theme.border,
						},
					]}
				>
					<ThemedText
						style={[styles.bigBtnText, { color: theme.btnText }]}
					>
						{counterpartLabel} ({counterpartCount})
					</ThemedText>
				</Pressable>

				{/* 하단 바텀 시트 (Modal) */}
				<Modal
					animationType="slide"
					transparent
					visible={sheetVisible}
					onRequestClose={() => setSheetVisible(false)}
				>
					{/* 반투명 배경 */}
					<Pressable
						style={styles.backdrop}
						onPress={() => setSheetVisible(false)}
						accessible={false}
					/>
					{/* 시트 컨텐츠 */}
					<View
						style={[
							styles.sheet,
							{
								backgroundColor: "lightgray",
								borderColor: theme.border,
							},
						]}
					>
						<Pressable style={styles.sheetHandle} disabled />
						<Pressable style={styles.sheetItem} onPress={onLogout}>
							<ThemedText style={styles.sheetItemText}>
								로그아웃
							</ThemedText>
						</Pressable>
						<View
							style={[
								styles.sheetDivider,
								{ backgroundColor: "gray" },
							]}
						/>
						<Pressable
							style={styles.sheetItem}
							onPress={onChangePassword}
						>
							<ThemedText style={styles.sheetItemText}>
								비밀번호 변경
							</ThemedText>
						</Pressable>
						<Pressable
							style={styles.sheetItem}
							onPress={onChangeProfileImage}
						>
							<ThemedText style={styles.sheetItemText}>
								프로필 이미지 변경
							</ThemedText>
						</Pressable>
						<Pressable
							style={styles.sheetItem}
							onPress={onChangeUsername}
						>
							<ThemedText style={styles.sheetItemText}>
								사용자 이름 변경
							</ThemedText>
						</Pressable>

						{/* iOS 스타일 취소 버튼 느낌 */}
						<Pressable
							style={[
								styles.sheetCancel,
								{
									backgroundColor: theme.inputBg,
									borderColor: theme.border,
								},
							]}
							onPress={() => setSheetVisible(false)}
						>
							<ThemedText
								style={[
									// styles.sheetItemText,
									{ textAlign: "center" },
								]}
							>
								닫기
							</ThemedText>
						</Pressable>
					</View>
				</Modal>
			</ThemedView>
		</SafeAreaView>
	);
}

const AVATAR = 160;

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 16 },
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	iconBtn: {
		padding: 8,
	},
	card: {
		borderWidth: 1,
		borderRadius: 16,
		paddingVertical: 20,
		paddingHorizontal: 16,
	},
	profileBox: {
		alignItems: "center",
		gap: 18,
	},
	avatar: {
		width: AVATAR,
		height: AVATAR,
		borderRadius: AVATAR / 2,
		marginBottom: 6,
		backgroundColor: "#e5e7eb",
	},
	name: { fontSize: 26, fontWeight: "700" },
	email: { fontSize: 18 },
	bigBtn: {
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		borderWidth: 1,
	},
	bigBtnText: { fontSize: 16, fontWeight: "700" },

	// Bottom Sheet styles
	backdrop: {
		...StyleSheet.absoluteFillObject,
		// backgroundColor: "rgba(0,0,0,0.35)",
	},
	sheet: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		paddingTop: 8,
		paddingBottom: 24,
		paddingHorizontal: 16,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		borderWidth: 1,
		gap: 4,
	},
	sheetHandle: {
		alignSelf: "center",
		width: 44,
		height: 5,
		borderRadius: 3,
		backgroundColor: "#9ca3af",
		marginBottom: 4,
		opacity: 0.6,
	},
	sheetItem: {
		paddingVertical: 14,
	},
	sheetItemText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	sheetDivider: {
		height: StyleSheet.hairlineWidth,
		marginVertical: 4,
	},
	sheetCancel: {
		marginTop: 8,
		borderRadius: 12,
		borderWidth: 1,
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
});
