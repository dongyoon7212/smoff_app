// app/profile/change-photo.tsx (혹은 (tabs)/my.tsx에서 버튼으로 실행)
import { changeProfileImgRequest } from "@/apis/accountApis";
import { uploadProfilePhotoAsync } from "@/lib/uploadProfilePhoto";
import { useAuth } from "@/stores/useAuth";
import { ThemedText, ThemedView } from "@/theme/Themed";
import { useTheme } from "@/theme/ThemeProvider";
import { useMutation } from "@tanstack/react-query";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePhotoScreen() {
	const { theme } = useTheme();
	const user = useAuth((s) => s.user);
	const setUser = useAuth((s) => s.setUser);
	const [preview, setPreview] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	const saveMutation = useMutation({
		mutationFn: changeProfileImgRequest,
		onSuccess: (resp) => {
			if (resp.status === "success") {
				Alert.alert("완료", "프로필 이미지가 변경되었습니다.", [
					{ text: "확인", onPress: () => router.back() },
				]);
			} else {
				Alert.alert("실패", resp.message);
			}
		},
		onError: () => Alert.alert("오류", "저장 중 문제가 발생했습니다."),
	});

	const pickImage = async () => {
		// 1) 권한 + 라이브러리에서 이미지 선택
		const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!perm.granted) {
			Alert.alert("권한 필요", "사진 보관함 접근 권한을 허용해 주세요.");
			return;
		}
		const res = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true, // 크롭 UI
			quality: 1, // 원본 퀄 (추후 압축에서 조절)
		});
		if (res.canceled) return;

		const asset = res.assets[0]; // { uri, width, height, fileSize, ... }
		setPreview(asset.uri); // 미리보기
	};

	const uploadAndSave = async () => {
		if (!user?.userId || !preview) return;
		try {
			setBusy(true);

			// 2) (선택) 업로드 최적화: 리사이즈/압축 (가로 1024px, JPEG 0.8)
			const m = await ImageManipulator.manipulateAsync(
				preview,
				[{ resize: { width: 1024 } }],
				{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
			); // m.uri: 새 파일의 file:// URI. :contentReference[oaicite:4]{index=4}

			// 3) Expo에서는 fetch(uri)로 Blob 만들 수 있음
			const resp = await fetch(m.uri);
			const blob = await resp.blob(); // Firebase Web SDK는 Blob 업로드 지원 :contentReference[oaicite:5]{index=5}

			// 4) Firebase Storage에 업로드 → 다운로드 URL 획득
			const url = await uploadProfilePhotoAsync(user.userId, blob, "jpg"); // getDownloadURL 내부 구현 참고 :contentReference[oaicite:6]{index=6}

			// 5) 백엔드에 URL 저장
			const result = await saveMutation.mutateAsync({
				userId: Number(user.userId),
				profileImg: url,
			});
			if (result.status === "success") {
				// 전역 스토어에 즉시 반영
				setUser({ profileImg: url });
			}
		} catch (e: any) {
			Alert.alert(
				"업로드 오류",
				e?.message ?? "이미지 업로드 중 문제가 발생했습니다."
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: theme.bg }}
			edges={["top", "left", "right"]}
		>
			<ThemedView
				style={[styles.container, { backgroundColor: theme.bg }]}
			>
				<ThemedText style={styles.title}>프로필 사진 변경</ThemedText>

				{preview ? (
					<Image source={{ uri: preview }} style={styles.preview} />
				) : (
					<View style={[styles.preview, styles.previewPlaceholder]}>
						<ThemedText muted>
							미리보기가 여기에 표시됩니다
						</ThemedText>
					</View>
				)}

				<Pressable
					onPress={pickImage}
					style={[styles.btn, { backgroundColor: theme.card }]}
				>
					<ThemedText style={{ color: theme.btnText }}>
						사진 선택
					</ThemedText>
				</Pressable>
				{!!preview ? (
					<Pressable
						onPress={uploadAndSave}
						disabled={!preview || busy}
						style={[styles.btn, { backgroundColor: theme.card }]}
					>
						{busy ? (
							<ActivityIndicator />
						) : (
							<ThemedText style={{ color: theme.btnText }}>
								업로드 & 저장
							</ThemedText>
						)}
					</Pressable>
				) : (
					<></>
				)}
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 12 },
	title: { fontSize: 20, fontWeight: "800", marginBottom: 8 },
	preview: { width: "100%", aspectRatio: 1, borderRadius: 12 },
	previewPlaceholder: {
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#e5e7eb",
	},
	btn: { padding: 14, borderRadius: 12, alignItems: "center" },
	btnPrimary: {
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
		backgroundColor: "#111827",
	},
});
