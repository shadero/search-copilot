import { useEffect, useState } from "react";
import FetchSearchNotes, { SEARCH_SORTS, type SearchSort } from './note-api/searches';
import SearchBar from "./components/SearchBar";
import ResultTable from "./components/ResultTable";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

type SearchResult = {
	name: string,
	url: string
};

function SearchResultRow({ name, url }: SearchResult) {
	return (
		<tr>
			<td>{name}</td>
			<td><a href={url}>{url}</a></td>
		</tr>
	);
}

function SearchPage() {
	const [queryParam, setQueryParam] = useQueryStates(
		{
			query: parseAsString.withDefault(""),
			sort: parseAsStringLiteral(SEARCH_SORTS).withDefault("popular"),
			size: parseAsInteger.withDefault(10),
		},
		{ history: "push" });
	const [inputQuery, setInputQuery] = useState<string>("");
	const [results, setResults] = useState<SearchResult[]>([]);

	function fetchResults(query: string, sort: SearchSort = "popular", size: number = 10) {
		FetchSearchNotes(query, sort, size).then(data => {
			console.log(`Fetching search results for query: ${query}`);
			const result = data.data.notes.contents.map(note => {
				return { name: note.name, url: `https://note.com/${note.user.urlname}/n/${note.key}` } as SearchResult;
			});
			setResults(result);
		}).catch(error => {
			console.error("Error fetching search results:", error);
			setResults([]);
		});
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setQueryParam({ query: inputQuery.trim() });
	};

	useEffect(() => {
		setInputQuery(queryParam.query);
		fetchResults(queryParam.query, queryParam.sort!, queryParam.size);
	}, [queryParam]);

	const headers = ["Name", "URL"];
	const rows = results.map((result, index) => (
		<SearchResultRow key={index} name={result.name} url={result.url} />
	));
	return (
		<>
			<SearchBar initialQuery={inputQuery} setQuery={setInputQuery} onSubmit={handleSubmit} />
			<ResultTable headers={headers} rows={rows} />
		</>
	);
}

export default SearchPage;