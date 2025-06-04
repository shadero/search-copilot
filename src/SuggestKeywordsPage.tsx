import ResultTable from "./components/ResultTable";
import SearchBar from "./components/SearchBar";
import { useEffect, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { FetchHashtags } from "./note-api/searches";
import OptionSelectBox from "./components/OptionSelectBox";

type SuggestKeywordResult = {
	name: string,
};

function SuggestResultRow({ name }: SuggestKeywordResult) {
	return (
		<tr>
			<td>{name}</td>
		</tr>
	);
}

export default function SuggestKeywordsPage() {
	const [queryParams, setQueryParams] = useQueryStates(
		{
			query: parseAsString.withDefault(""),
			size: parseAsInteger.withDefault(10),
		},
		{ history: "push" }
	);
	const [inputQuery, setInputQuery] = useState<string>("");
	const [results, setResults] = useState<SuggestKeywordResult[]>([{ name: `Keyword 1` }]);

	async function fetchResults(query: string, size: number = 10): Promise<SuggestKeywordResult[]> {
		console.log(`Fetching search results for query: ${query}`);
		const result = await FetchHashtags(query, size)
			.then(data => {
				return data.contents.map(
					content => { return { name: content.name }; }
				);
			})
			.catch(error => {
				console.error("Error fetching search results:", error);
				return [];
			});
		return result;
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setQueryParams({ query: inputQuery.trim() });
	};

	useEffect(() => {
		setInputQuery(queryParams.query);
		fetchResults(queryParams.query, queryParams.size).then(setResults);
	}, [queryParams]);

	return (
		<>
			<SearchBar initialQuery={inputQuery} setQuery={setInputQuery} onSubmit={handleSubmit} />
			<OptionSelectBox
				map={{
					10: "10件",
					15: "15件",
					20: "20件",
					25: "25件",
					50: "50件",
				}}
				onChange={(e) => { setQueryParams({ size: parseInt(e.target.value) }); }}
				defaultValue={queryParams.size.toString()}
			/>
			<p>検索結果: {results.length}件</p>
			<ResultTable
				headers={["Suggested Keywords"]}
				rows={
					results.map(
						(result, index) => (<SuggestResultRow key={index} name={result.name} />)
					)
				}
			/>
		</>
	);
}
