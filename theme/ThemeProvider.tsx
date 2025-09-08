import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { AppTheme, darkTheme, lightTheme } from "./colors";

type ThemeContextType = {
	theme: AppTheme;
	scheme: ColorSchemeName;
	setOverride: (v: "light" | "dark" | "system") => Promise<void>;
	override: "light" | "dark" | "system";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemScheme = useColorScheme(); // 'light' | 'dark' | null
	const [override, setOverrideState] = useState<"light" | "dark" | "system">(
		"system"
	);

	useEffect(() => {
		(async () => {
			const saved = await AsyncStorage.getItem("themeOverride");
			if (saved === "light" || saved === "dark" || saved === "system") {
				setOverrideState(saved);
			}
		})();
	}, []);

	const setOverride = async (v: "light" | "dark" | "system") => {
		setOverrideState(v);
		await AsyncStorage.setItem("themeOverride", v);
	};

	const activeMode =
		override === "system" ? systemScheme ?? "light" : override;
	const theme = useMemo(
		() => (activeMode === "dark" ? darkTheme : lightTheme),
		[activeMode]
	);

	return (
		<ThemeContext.Provider
			value={{ theme, scheme: systemScheme, setOverride, override }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
};
