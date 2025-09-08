export type AppTheme = {
	mode: "light" | "dark";
	bg: string;
	text: string;
	btnText: string;
	mutedText: string;
	border: string;
	card: string;
	primary: string;
	placeholder: string;
	tabBg: string;
	tabActive: string;
	tabInactive: string;
	inputBg: string;
};

export const lightTheme: AppTheme = {
	mode: "light",
	bg: "#FFFFFF",
	text: "#111827",
	btnText: "#FFFFFF",
	mutedText: "#6B7280",
	border: "#E5E7EB",
	card: "#111827",
	primary: "#111827",
	placeholder: "#6B7280",
	tabBg: "#FFFFFF",
	tabActive: "#111827",
	tabInactive: "#9CA3AF",
	inputBg: "#FFFFFF",
};

export const darkTheme: AppTheme = {
	mode: "dark",
	bg: "#191919",
	text: "#E5E7EB",
	btnText: "#191919",
	mutedText: "#A1A1AA",
	border: "#374151",
	card: "#F9FAFB",
	primary: "#F3F4F6",
	placeholder: "#9CA3AF",
	tabBg: "#0B0F14",
	tabActive: "#F3F4F6",
	tabInactive: "#6B7280",
	inputBg: "#0F141A",
};
