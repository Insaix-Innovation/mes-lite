export const formatDate = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	return formattedDate;
};

export const formatDateWithTimezone = (inputDate) => {
	const date = new Date(inputDate);
	date.setHours(0);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

	const timeZoneOffset = "%2B08";

	// Combine into desired format
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}000${timeZoneOffset}`;
};

// Convert date to Unix timestamp (in seconds)
export const convertToUnixTimestamp = (date) => {
	return Math.floor(new Date(date).getTime() / 1000);
};
