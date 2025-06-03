import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FetchSearchNotes from './note-api/api';
import SearchBar from "./components/SearchBar";
import ResultTable from "./components/ResultTable";

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
	const [searchParams, setSearchParams] = useSearchParams();
	const initialQuery = searchParams.get("q") || "";
	const [query, setQuery] = useState<string>(initialQuery);
	const [results, setResults] = useState<SearchResult[]>([]);

	function fetchResults(query: string) {
		FetchSearchNotes(query, "popular", 10).then(data => {
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
		setSearchParams({q: query.trim()});
		fetchResults(query);
	};

	useEffect(() => {
		if (query) {
			fetchResults(query);
		}
	}, []);

	const headers = ["Name", "URL"];
	const rows = results.map((result, index) => (
		<SearchResultRow key={index} name={result.name} url={result.url} />
	));
	return (
		<>
			<SearchBar initialQuery={query} setQuery={setQuery} onSubmit={handleSubmit} />
			<ResultTable headers={headers} rows={rows} />
		</>
	);
}

export default SearchPage;