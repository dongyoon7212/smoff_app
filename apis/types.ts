export interface ApiResponse<T> {
	status: "success" | "failed";
	message: string;
	data: T;
}

export interface sendVerifyEmail {
	email: string;
}

export interface SigninData {
	email: string;
	password: string;
}

export interface SignupData {
	email: string;
	password: string;
	username: string;
	roleType: string;
	age: number;
	profileImg: string;
}

export interface AddPledgeData {
	challengerId: number;
	signatureImg: string;
}

export interface updateUsernameData {
	userId: number;
	username: string;
}
