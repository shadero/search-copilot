import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FetchSearchNotes from './note-api/api';
import SearchBar from "./components/SearchBar";

type SearchResult = {
	name: string,
	url: string
};

function SearchRow({ name, url }: SearchResult) {
	return (
		<tr>
			<td>{name}</td>
			<td><a href={url}>{url}</a></td>
		</tr>
	);
}

function SearchResultTable({ results }: { results: SearchResult[] }) {
	const rows = results.map((result, index) => (
		<SearchRow key={index} name={result.name} url={result.url} />
	));
	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>URL</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}

function SearchPage() {
	const searchParams = new URLSearchParams(useLocation().search);
	const initialQuery = searchParams.get("q") || "";
	const [query, setQuery] = useState<string>(initialQuery);
	const [results, setResults] = useState<SearchResult[]>([]);
	const navigate = useNavigate();

	function fetchResults(query: string) {
		FetchSearchNotes(query, "popular", 10).then(data => {
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
		if (query.trim()) {
			navigate(`/search?q=${encodeURIComponent(query)}`);
		}
		else {
			navigate("/search");
		}
		fetchResults(query);
	};

	useEffect(() => {
		const initialQuery = searchParams.get("q") || "";
		if (initialQuery) {
			fetchResults(initialQuery);
		}
	}, []);

	return (
		<>
			<SearchBar query={query} setQuery={setQuery} onSubmit={handleSubmit} />
			<SearchResultTable results={results.length > 0 ? results : []} />
		</>
	);
}

export default SearchPage;