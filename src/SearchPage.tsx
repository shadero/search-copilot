import { useEffect, useState } from "react";
import FetchSearchNotes, { SEARCH_SORTS, type SearchSort } from './note-api/searches';
import SearchBar from "./components/SearchBar";
import ResultTable from "./components/ResultTable";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import OptionSelectBox from "./components/OptionSelectBox";

type SearchResult = {
	name: string,
	url: string
};

function SearchResultRow({ name, url }: SearchResult) {
	return (
		<>
			<td>{name}</td>
			<td>
				<a className="link link-primary" href={url}>Link</a>
			</td>
		</>
	);
}

export default function SearchPage() {
	const baseUrl = 'http://localhost:8080/https://note.com';
	const [queryParam, setQueryParam] = useQueryStates(
		{
			query: parseAsString.withDefault(""),
			sort: parseAsStringLiteral(SEARCH_SORTS).withDefault("popular"),
			size: parseAsInteger.withDefault(10),
		},
		{ history: "push" });
	const [inputQuery, setInputQuery] = useState<string>("");
	const [results, setResults] = useState<SearchResult[]>([]);

	async function fetchResults(
		query: string,
		sort: SearchSort = "popular",
		size: number = 10
	): Promise<SearchResult[]> {
		console.log(`Fetching search results for query: ${query}`);
		const result = FetchSearchNotes(baseUrl, query, sort, size)
			.then(data => {
				return data.contents.map(
					note => {
						const url = `https://note.com/${note.user.urlname}/n/${note.key}`
						return { name: note.name, url: url } as SearchResult;
					}
				);
			}).catch(error => {
				console.error("Error fetching search results:", error);
				return [];
			});
		return result;
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setQueryParam({ query: inputQuery.trim() });
	};

	useEffect(() => {
		setInputQuery(queryParam.query);
		fetchResults(queryParam.query, queryParam.sort!, queryParam.size).then(setResults);
	}, [queryParam]);

	return (
		<>
			<SearchBar initialQuery={inputQuery} setQuery={setInputQuery} onSubmit={handleSubmit} />
			<OptionSelectBox
				name="表示件数"
				map={{
					10: "10件",
					15: "15件",
					20: "20件",
					25: "25件",
					50: "50件",
				}}
				onChange={(e) => { setQueryParam({ size: parseInt(e.target.value) }); }}
				defaultValue={queryParam.size.toString()}
			/>
			<OptionSelectBox
				name="ソート"
				map={{
					[SEARCH_SORTS[0]]: "人気順",
					[SEARCH_SORTS[1]]: "ホット順",
					[SEARCH_SORTS[2]]: "新着順",
				}}
				onChange={(e) => { setQueryParam({ sort: e.target.value as SearchSort }); }}
				defaultValue={queryParam.sort}
			/>
			<p>検索結果: {results.length}件</p>
			<div className="max-w-3xl">
				<ResultTable
					headers={["Name", "URL"]}
					rows={
						results.map((result) => (
							<SearchResultRow name={result.name} url={result.url} />
						))
					}
				/>
			</div>
		</>
	);
}
