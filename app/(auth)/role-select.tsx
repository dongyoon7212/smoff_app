// app/(auth)/role-select.tsx (카드 한 개 예시)
import { ThemedCard, ThemedText, ThemedView } from "@/theme/Themed";
import { useTheme } from "@/theme/ThemeProvider";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function RoleSelect() {
	const { theme } = useTheme();
	const titleColor = theme.mode === "dark" ? "#111827" : "#FFFFFF";
	const descColor = theme.mode === "dark" ? "#374151" : "#E5E7EB";

	return (
		<ThemedView style={[styles.container, { backgroundColor: theme.bg }]}>
			{/* <ThemedText style={styles.title}>역할을 선택하세요</ThemedText> */}

			<ThemedView style={styles.column}>
				{/* Challenger */}
				<Link href="/(auth)/signup-email?role=CHALLENGER" asChild>
					<Pressable
						style={({ pressed }) => [
							styles.pressable,
							pressed && { opacity: 0.9 },
						]}
					>
						<ThemedCard
							style={[
								styles.card,
								{
									backgroundColor: theme.card,
									borderColor: theme.border,
								},
							]}
						>
							<ThemedText
								style={[
									styles.cardTitle,
									{ color: titleColor },
								]}
							>
								Challenger
							</ThemedText>
							<ThemedText
								muted
								style={[styles.cardDesc, { color: descColor }]}
							>
								금연을 시도하는 멋진 사람
							</ThemedText>
						</ThemedCard>
					</Pressable>
				</Link>

				{/* Supporter */}
				<Link href="/(auth)/signup-email?role=SUPPORTER" asChild>
					<Pressable
						style={({ pressed }) => [
							styles.pressable,
							pressed && { opacity: 0.9 },
						]}
					>
						<ThemedCard
							style={[
								styles.card,
								{
									backgroundColor: theme.card,
									borderColor: theme.border,
								},
							]}
						>
							<ThemedText
								style={[
									styles.cardTitle,
									{ color: titleColor },
								]}
							>
								Supporter
							</ThemedText>
							<ThemedText
								muted
								style={[styles.cardDesc, { color: descColor }]}
							>
								금연을 도와주는 멋진 사람
							</ThemedText>
						</ThemedCard>
					</Pressable>
				</Link>
			</ThemedView>
		</ThemedView>
	);
}

const CARD_MIN_HEIGHT = 140;

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, gap: 16 },
	title: {
		fontSize: 40,
		fontWeight: "700",
		marginBottom: 8,
	},
	column: {
		flexDirection: "column",
		gap: 16, // RN 0.71+ 지원 (미지원이면 아래 주석 참고)
		marginTop: 24,
	},
	pressable: { borderRadius: 16 },
	card: {
		minHeight: CARD_MIN_HEIGHT,
		borderWidth: 1,
		borderRadius: 16,
		padding: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	cardTitle: { fontSize: 25, fontWeight: "700", marginBottom: 6 },
	cardDesc: { fontSize: 16, textAlign: "center", lineHeight: 20 },
});
