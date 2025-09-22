import { storage } from "@/apis/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadProfilePhotoAsync(
	userId: number,
	file: Blob,
	ext = "jpg"
) {
	const path = `profile-img/${userId}/${Date.now()}.${ext}`;
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file, {
		contentType: ext === "png" ? "image/png" : "image/jpeg",
	});
	const url = await getDownloadURL(storageRef);
	return url;
}
