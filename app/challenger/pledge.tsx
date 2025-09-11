// app/challenger/pledge.tsx
import { addPledgeRequest } from "@/apis/pledgeApis";
import { uploadSignatureToFirebase } from "@/lib/uploadSignature";
import { useAuth } from "@/stores/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
	Alert,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Signature, { SignatureViewRef } from "react-native-signature-canvas";

export default function PledgeScreen() {
	const signatureRef = useRef<SignatureViewRef>(null);
	const user = useAuth((s) => s.user);
	const insets = useSafeAreaInsets();
	const [submitting, setSubmitting] = useState(false);
	const qc = useQueryClient();

	const m = useMutation({
		mutationFn: addPledgeRequest,
		onSuccess: (response) => {
			if (response.status === "success") {
				qc.invalidateQueries({ queryKey: ["pledge/me", user?.userId] });
				Alert.alert("저장 완료", "서약서가 저장되었습니다.", [
					{
						text: "확인",
						onPress: () => router.replace("/(tabs)"),
					}, // ✅ 구체 화면
				]);
			} else {
				Alert.alert("오류", response.message);
				return;
			}
		},
		onError: (e: any) => {
			Alert.alert("오류", e?.message ?? "저장 중 오류가 발생했습니다.");
		},
		onSettled: () => setSubmitting(false),
	});

	const handleOK = async (sig: string) => {
		if (typeof user?.userId !== "number") {
			Alert.alert("오류", "사용자 정보가 올바르지 않습니다.");
			return;
		}

		try {
			setSubmitting(true);
			// 1) 파이어베이스에 이미지 업로드
			const { url } = await uploadSignatureToFirebase(
				sig,
				Number(user.userId)
			);

			// 2) 우리 백엔드에 "서약서 등록" + 저장된 이미지 URL 전달
			await m.mutateAsync({
				challengerId: Number(user.userId),
				signatureImg: url,
			});

			// onSuccess에서 라우팅
		} catch (e: any) {
			Alert.alert("오류", e?.message ?? "업로드 중 오류가 발생했습니다.");
			setSubmitting(false);
		}
	};

	const handleEmpty = () => Alert.alert("알림", "서명이 비어 있습니다.");
	const handleClear = () => signatureRef.current?.clearSignature();

	const webStyle = `
     	html, body { height: 100%; }
		.m-signature-pad { height: 100%; }
		.m-signature-pad--body {
			height: 100% !important;           /* ← 푸터 차감 없이 꽉 채우기 */
			border: 1px solid #e5e7eb;
		}
		.m-signature-pad--footer {
			display: none !important;          /* ← 버튼 숨김 */
			height: 0 !important;              /* ← 남는 여백 제거 */
			margin: 0 !important;
			padding: 0 !important;
		}
  `;

	return (
		<View
			style={[
				styles.container,
				{ paddingTop: insets.top, paddingBottom: insets.bottom },
			]}
		>
			{/* 상단: 제목 + 서약 본문 */}
			<ScrollView
				style={styles.top}
				contentContainerStyle={{ paddingBottom: 12 }}
				showsVerticalScrollIndicator={false}
			>
				<Text style={styles.title}>서약서</Text>

				<Text style={styles.paragraph}>
					저는 오늘부로 모든 형태의 담배 및 니코틴 제품(궐련,
					전자담배, 니코틴 파우치, 물담배 등)을 사용하지 않기로
					결심하며, 금연에 성공하기 위해 다음의 사항을 성실히 실천할
					것을 서약합니다.
				</Text>

				<Text style={styles.bullet}>
					1. 금연 목표를 분명히 하고, 매일 실천하겠습니다.
				</Text>
				<Text style={styles.bullet}>
					2. 흡연 욕구가 올라올 때에는 대체 활동(물 마시기, 심호흡,
					걷기 등)으로 갈망을 관리하겠습니다.
				</Text>
				<Text style={styles.bullet}>
					3. 흡연을 유발하는 상황과 유혹을 피하고, 주변의
					지지자(서포터)와 가족·동료의 도움을 적극적으로 구하겠습니다.
				</Text>
				<Text style={styles.bullet}>
					4. 만약 실수로 흡연하더라도 좌절하지 않고 즉시 다시 금연을
					이어가겠습니다.
				</Text>
				<Text style={styles.bullet}>
					5. 간접흡연과 베이핑 노출을 피하고, 금연을 원하는 다른
					사람도 존중하고 격려하겠습니다.
				</Text>

				<Text style={styles.paragraph}>
					위 내용을 이해하고 동의하며, 최선을 다해 금연을 실천할 것을
					서약합니다.
				</Text>
			</ScrollView>

			{/* 서명 영역 */}
			<View style={styles.canvasBox}>
				<Signature
					ref={signatureRef}
					onOK={handleOK}
					onEmpty={handleEmpty}
					webStyle={webStyle}
					backgroundColor="#ffffff"
					penColor="#111827"
					descriptionText="아래 상자 안에 서명해 주세요"
					clearText="지우기"
					confirmText="저장"
					autoClear={false}
					trimWhitespace
					imageType="image/png"
					style={{ flex: 1 }}
				/>
			</View>

			{/* 하단 액션 */}
			<View style={styles.actions}>
				<Pill onPress={handleClear} label="지우기" />
				<Pill
					primary
					disabled={submitting}
					onPress={() => signatureRef.current?.readSignature()}
					label={submitting ? "저장 중…" : "저장"}
				/>
			</View>
		</View>
	);
}

function Pill({
	onPress,
	label,
	disabled,
	primary,
}: {
	onPress: () => void;
	label: string;
	disabled?: boolean;
	primary?: boolean;
}) {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={[
				styles.pill,
				primary ? styles.pillPrimary : styles.pillSecondary,
				disabled && { opacity: 0.6 },
			]}
			accessibilityRole="button"
		>
			<Text style={[styles.pillText, primary && { color: "white" }]}>
				{label}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: 16 },
	top: { maxHeight: 460 }, // 서약 본문 스크롤 높이 (디자인에 맞게 조절)
	title: {
		textAlign: "center",
		fontSize: 25,
		fontWeight: "800",
		marginBottom: 12,
		marginTop: 12,
	},
	paragraph: {
		fontSize: 18,
		color: "#333",
		lineHeight: 30,
		marginBottom: 12,
	},
	bullet: { fontSize: 18, color: "#111827", lineHeight: 30, marginBottom: 4 },

	canvasBox: {
		flex: 1,
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: "#fff",
		marginTop: 0,
	},
	actions: {
		flexDirection: "row",
		gap: 8,
		justifyContent: "space-between",
		paddingVertical: 12,
	},
	pill: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 999,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e5e7eb",
		flex: 1,
	},
	pillPrimary: { backgroundColor: "#111827", borderColor: "#111827" },
	pillSecondary: { backgroundColor: "#fff" },
	pillText: { fontWeight: "700" },
});
