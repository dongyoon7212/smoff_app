import { getPledgeRequest } from "@/apis/pledgeApis";
import { useAuth } from "@/stores/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PledgeResp<T = any> = {
	status: "success" | "failed";
	message: string;
	data: T | null;
};

// 서버가 주는 data 예시 타입(필요에 맞게 수정)
type PledgeData = {
	pledgeId: number;
	signatureImg: string; // Firebase 등 저장된 서명 이미지 URL
	createDt?: string;
	// content?: string; // 서약 본문(백엔드에 저장해두었거나 프론트에서 고정문구 사용)
};

export default function PledgeViewScreen() {
	const insets = useSafeAreaInsets();
	const user = useAuth((s) => s.user);

	const {
		data: resp,
		status,
		isFetching,
		isError,
		error,
	} = useQuery<PledgeResp<PledgeData>>({
		queryKey: ["pledge/me", user?.userId],
		enabled: !!user?.userId,
		queryFn: () => getPledgeRequest(user!.userId),
		refetchOnMount: "always",
	});

	const isPending = status === "pending" || (isFetching && !resp);

	function formatYYYYMMDD(input: string | number | Date) {
		const d = new Date(input);
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}.${mm}.${dd}`;
	}

	if (isPending) {
		return (
			<View
				style={[
					styles.center,
					{ paddingTop: insets.top, paddingBottom: insets.bottom },
				]}
			>
				<ActivityIndicator />
				<Text style={{ marginTop: 8 }}>불러오는 중…</Text>
			</View>
		);
	}

	if (isError) {
		return (
			<View
				style={[
					styles.center,
					{
						paddingTop: insets.top,
						paddingBottom: insets.bottom,
						paddingHorizontal: 16,
					},
				]}
			>
				<Text>서약서를 불러오는 중 오류가 발생했습니다.</Text>
				<Text style={{ opacity: 0.6, marginTop: 4 }}>
					{String((error as any)?.message ?? "")}
				</Text>
			</View>
		);
	}

	if (resp?.status === "failed") {
		return (
			<View
				style={[
					styles.center,
					{
						paddingTop: insets.top,
						paddingBottom: insets.bottom,
						paddingHorizontal: 16,
					},
				]}
			>
				<Text>{resp?.message || "서약서를 불러오지 못했습니다."}</Text>
			</View>
		);
	}

	const pledge = resp?.data ?? null;
	if (!pledge) {
		return (
			<View
				style={[
					styles.center,
					{
						paddingTop: insets.top,
						paddingBottom: insets.bottom,
						paddingHorizontal: 16,
					},
				]}
			>
				<Text>등록된 서약서가 없습니다.</Text>
			</View>
		);
	}

	// 서버 content가 없으면 프론트 기본 본문 사용(필요시 수정)
	const defaultContent = [
		"저는 오늘부로 모든 형태의 담배 및 니코틴 제품(궐련, 전자담배, 니코틴 파우치, 물담배 등)을 사용하지 않기로 결심하며, 금연에 성공하기 위해 다음을 성실히 실천할 것을 서약합니다.",
		"1) 금연 목표를 분명히 하고 매일 실천합니다.",
		"2) 흡연 욕구 시 대체 활동(물 마시기, 심호흡, 걷기 등)으로 갈망을 관리합니다.",
		"3) 흡연 유발 상황을 피하고 주변의 지지(서포터·가족·동료)를 적극적으로 구합니다.",
		"4) 실수로 흡연하더라도 좌절하지 않고 즉시 금연을 이어갑니다.",
		"5) 간접흡연·베이핑 노출을 피하고, 금연을 원하는 다른 사람도 존중하고 격려합니다.",
		"위에 동의하며, 최선을 다해 금연을 실천할 것을 서약합니다.",
	].join("\n");

	return (
		<View
			style={{
				flex: 1,
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
			}}
		>
			<ScrollView contentContainerStyle={{ padding: 20 }}>
				<Text style={styles.title}>나의 서약서</Text>

				{!!pledge.createDt && (
					<Text style={styles.subtle}>
						{formatYYYYMMDD(pledge.createDt)}
					</Text>
				)}

				<Text style={styles.body}>{defaultContent}</Text>

				{/* 서명 이미지 (탭하면 풀스크린 미리보기) */}
				<Pressable style={styles.sigBox}>
					{pledge.signatureImg ? (
						<Image
							source={{ uri: pledge.signatureImg }}
							style={styles.sigImg}
							resizeMode="contain"
						/>
					) : (
						<Text style={{ color: "#888" }}>
							서명 이미지가 없습니다.
						</Text>
					)}
				</Pressable>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	center: { flex: 1, alignItems: "center", justifyContent: "center" },
	title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
	subtle: { color: "#6b7280", marginBottom: 12 },
	body: {
		fontSize: 16,
		lineHeight: 35,
		color: "#111827",
		// whiteSpace: "pre-wrap" as any,
	},
	caption: {
		fontSize: 14,
		fontWeight: "700",
		color: "#374151",
	},
	sigBox: {
		marginTop: 40,
		height: 220,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	sigImg: { width: "100%", height: "100%" },
	modalBg: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.9)",
		alignItems: "center",
		justifyContent: "center",
	},
	modalImg: { width: "92%", height: "80%" },
});
