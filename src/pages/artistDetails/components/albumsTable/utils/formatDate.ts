export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("pt-BR", {
		year: "2-digit",
		month: "2-digit",
		day: "numeric",
	});
};
