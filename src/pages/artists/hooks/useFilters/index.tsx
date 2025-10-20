import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import { FilterTypes } from "@/pages/artists/hooks/useFilters/types";

export const useFilters = () => {
	const [query, setQuery] = useQueryState("query", { defaultValue: "" });
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
	const [type, setType] = useQueryState(
		"type",
		parseAsStringEnum<FilterTypes>(Object.values(FilterTypes)).withDefault(
			FilterTypes.ARTIST,
		),
	);

	const handleSearch = (value: string) => {
		setQuery(value);
		setPage(1);
	};

	const handleType = (value: FilterTypes) => {
		setType(value);
		setPage(1);
	};

	return {
		query,
		setQuery: handleSearch,
		page,
		setPage,
		type,
		setType: handleType,
	};
};
