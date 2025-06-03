import { useSearchParams } from "react-router-dom";
import ResultTable from "./components/ResultTable";
import SearchBar from "./components/SearchBar";
import { useEffect, useState } from "react";

function SuggestResultRow({ keyword }: { keyword: string }) {
	return (
		<tr>
			<td>{keyword}</td>
		</tr>
	);
}

function SuggestKeywordsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialQuery = searchParams.get("q") || "";
	const [query, setQuery] = useState<string>(initialQuery);
	const [results, setResults] = useState([]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setSearchParams({ q: query.trim() });
	};

	const headers = ["Keyword"];
	const rows = [<SuggestResultRow keyword="Example Keyword" />];
	return (
		<>
			<SearchBar initialQuery={query} setQuery={setQuery} onSubmit={handleSubmit} />
			<ResultTable headers={headers} rows={rows} />
		</>
	);
}

export default SuggestKeywordsPage;