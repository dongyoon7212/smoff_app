import * as FileSystem from "expo-file-system";

export async function saveDataUrlPng(
	dataUrl: string,
	// filename = `signature_${Date.now()}.png`
	filename: string
) {
	if (!dataUrl.startsWith("data:image/")) {
		throw new Error("Invalid data URL");
	}
	const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
	const fileUri = FileSystem.documentDirectory + filename;

	await FileSystem.writeAsStringAsync(fileUri, base64, {
		encoding: FileSystem.EncodingType.Base64,
	});

	return fileUri; // e.g. "file:///.../signature_123.png"
}
