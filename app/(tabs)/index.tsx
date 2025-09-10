// app/(tabs)/index.tsx
import { getPledgeRequest } from "@/apis/pledgeApis";
import { useAuth } from "@/stores/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useEffect } from "react";
import { Alert, Button, Text, View } from "react-native";

type PledgeResp<T = any> = {
	status: "success" | "failed";
	message: string;
	data: T | null; // 서버 규약
};

export default function HomeScreen() {
	const user = useAuth((s) => s.user);
	const isChallenger = user?.roleType === "CHALLENGER";

	const {
		data: resp,
		status, // 'pending' | 'error' | 'success'
		isFetching, // 백그라운드 fetch 여부
		isError,
		error,
	} = useQuery<PledgeResp>({
		queryKey: ["pledge/me", user?.userId],
		enabled: !!user?.userId && isChallenger,
		queryFn: () => getPledgeRequest(user!.userId),
		refetchOnMount: "always", // 마운트 시 항상 최신 데이터 받아오기
		staleTime: 0, // 기본값(문서적 의미 강조)
	});

	// 최신 데이터가 확정된 이후에만 분기
	useEffect(() => {
		if (!isChallenger) return;
		if (status !== "success") return; // 성공 응답만
		if (isFetching) return; // 리패치 끝난 뒤에만

		const noPledge = resp?.status === "failed" && resp?.data === null;

		if (noPledge) {
			Alert.alert("서약서 작성", "서약서를 먼저 작성해주세요.", [
				{
					text: "확인",
					onPress: () => router.replace("/challenger/pledge"),
				},
			]);
		}
	}, [isChallenger, status, isFetching, resp]);

	// 초기·로딩 상태
	if (isChallenger && (status === "pending" || (isFetching && !resp))) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text>로딩중…</Text>
			</View>
		);
	}

	if (isError) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					padding: 16,
				}}
			>
				<Text>서약 정보를 불러오는 중 오류가 발생했습니다.</Text>
				<Text style={{ opacity: 0.6, marginTop: 4 }}>
					{String((error as any)?.message ?? "")}
				</Text>
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 12,
			}}
		>
			<Text style={{ fontSize: 22, fontWeight: "700" }}>홈</Text>
			{/* (디버그) 현재 상태 */}
			{isChallenger && status === "success" && (
				<Text style={{ opacity: 0.7 }}>
					{resp?.status === "success" && resp?.data !== null
						? "서약서가 등록되어 있어요."
						: "서약서가 아직 없어요."}
				</Text>
			)}
			<Button title="참기 (예시)" onPress={() => {}} />
			<Link href="/supporter/link">서포터: 챌린저 검색</Link>
		</View>
	);
}
