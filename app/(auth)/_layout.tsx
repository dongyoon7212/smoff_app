// app/(auth)/_layout.tsx
import StepHeader from "@/components/StepHeader";
import { Stack } from "expo-router";
export default function AuthLayout() {
	const STEP_TOTAL = 3;
	function getStep(routeName?: string) {
		switch (routeName) {
			case "role-select":
				return { current: 1, title: "역할 선택" };
			case "signup-email":
				return { current: 2, title: "이메일 · 비밀번호" };
			case "signup-profile":
				return { current: 3, title: "사용자 이름" };
			default:
				return null; // verify-email 등은 헤더 숨김
		}
	}

	return (
		<Stack
			screenOptions={{
				// 각 화면의 route 정보를 받아 커스텀 헤더 렌더
				header: ({ route }) => {
					const s = getStep(route?.name as string);
					if (!s) return null; // 단계가 없으면 헤더 노출 안 함
					return (
						<StepHeader
							current={s.current}
							total={STEP_TOTAL}
							title={s.title}
						/>
					);
				},
				headerShown: true, // 커스텀 헤더를 쓰므로 true
			}}
		>
			<Stack.Screen name="role-select" options={{ title: "역할 선택" }} />
			<Stack.Screen
				name="signup-email"
				options={{ title: "이메일/비밀번호" }}
			/>
			<Stack.Screen
				name="signup-profile"
				options={{ title: "사용자 이름" }}
			/>
			<Stack.Screen
				name="verify-email"
				options={{ title: "이메일 인증" }}
			/>
		</Stack>
	);
}
