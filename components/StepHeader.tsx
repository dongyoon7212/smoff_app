import { useTheme } from "@/theme/ThemeProvider";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = { current: number; total: number; title?: string };

export default function StepHeader({ current, total, title }: Props) {
	const { theme } = useTheme();
	const pct = Math.min(100, Math.max(0, (current / total) * 100));

	return (
		// ✅ 다이나믹 아일랜드/노치 영역을 자동 피함
		<SafeAreaView
			edges={["top"]}
			style={[
				styles.wrap,
				{ backgroundColor: theme.bg, borderBottomColor: theme.border },
			]}
		>
			{!!title && (
				<Text
					style={[styles.title, { color: theme.text }]}
					numberOfLines={1}
				>
					{title}
				</Text>
			)}
			<View
				style={[
					styles.bar,
					{ backgroundColor: theme.card, borderColor: theme.border },
				]}
			>
				<View
					style={[
						styles.fill,
						{ width: `${pct}%`, backgroundColor: "gray" },
					]}
				/>
			</View>
			<Text style={[styles.caption, { color: theme.mutedText }]}>
				{current}/{total}
			</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	wrap: {
		paddingTop: 8,
		paddingHorizontal: 16,
		paddingBottom: 10,
		borderBottomWidth: 1,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 8,
		textAlign: "center",
	},
	bar: { height: 8, borderRadius: 999, overflow: "hidden", borderWidth: 1 },
	fill: { height: "100%" },
	caption: {
		marginTop: 6,
		textAlign: "center",
		fontSize: 12,
		fontWeight: "600",
	},
});
