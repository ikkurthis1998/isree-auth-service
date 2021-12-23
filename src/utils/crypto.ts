import CryptoJS from "crypto-js";

export const encryptData = (data: string, password: string) => {
	return CryptoJS.AES.encrypt(data, password).toString();
};

export const decryptData = (encryptedData: string, password: string) => {
	const bytes = CryptoJS.AES.decrypt(encryptedData, password);
	const data = bytes.toString(CryptoJS.enc.Utf8);
	if (data) {
		return data;
	}
	return null;
};
