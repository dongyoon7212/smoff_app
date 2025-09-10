// libs/uploadSignature.ts
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import uuid from "react-native-uuid";
import { storage } from "../apis/firebaseConfig";
import { saveDataUrlPng } from "./saveDataUrlImage";

export async function uploadSignatureToFirebase(
	dataURL: string,
	userId: number
) {
	const fileName = `signature_${uuid.v4()}_${userId}.png`;
	const path = `signature-img/${fileName}`;

	// 1) Data URL → 로컬 PNG 저장
	const fileUri = await saveDataUrlPng(dataURL, fileName);

	const imageRef = ref(storage, path);

	// Read the file as a Blob (React Native example using fetch)
	const response = await fetch(fileUri);
	const blob = await response.blob();

	const uploadTask = await uploadBytes(imageRef, blob);

	const url = await getDownloadURL(imageRef);

	return { url };
}
