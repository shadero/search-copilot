import ResultTable, { ResultTd } from "./components/ResultTable";
import SearchBar from "./components/SearchBar";
import { useEffect, useState } from "react";
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { FetchHashtags, type HashtagData } from "./note-api/searches";
import OptionSelectBox from "./components/OptionSelectBox";
import { FetchRelatedHashtags, type RelatedHashtag } from "./note-api/hashtags";

type SuggestKeywordResult = {
	name: string,
};

function SuggestResultRow({ name }: SuggestKeywordResult) {
	return (
		<>
			<ResultTd>{name}</ResultTd>
		</>
	);
}

export default function SuggestKeywordsPage() {
	const baseUrl = 'http://localhost:8080/https://note.com';
	const [queryParams, setQueryParams] = useQueryStates(
		{
			query: parseAsString.withDefault(""),
			size: parseAsInteger.withDefault(10),
			related: parseAsBoolean.withDefault(false),
		},
		{ history: "push" }
	);
	const [inputQuery, setInputQuery] = useState<string>("");
	const [results, setResults] = useState<SuggestKeywordResult[]>([{ name: `Keyword 1` }]);

	function hashtagData2Result(data: HashtagData): SuggestKeywordResult[] {
		return data.contents.map(content => ({ name: content.name }));
	}

	function relatedHashtag2Result(data: RelatedHashtag[]): SuggestKeywordResult[] {
		return data.map(content => ({ name: content.name }));
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setQueryParams({ query: inputQuery.trim() });
	};

	useEffect(() => {
		setInputQuery(queryParams.query);
		if (queryParams.related) {
			FetchRelatedHashtags(baseUrl, queryParams.query)
				.then(relatedHashtag2Result)
				.then(setResults)
				.catch(() => { setResults([]); });
		} else {
			FetchHashtags(baseUrl, queryParams.query, queryParams.size)
				.then(hashtagData2Result)
				.then(setResults)
				.catch(() => { setResults([]); });
		}
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
			<OptionSelectBox
				map={{
					false: "サジェストキーワード",
					true: "関連キーワード",
				}}
				onChange={(e) => { setQueryParams({ related: e.target.value === "true" }); }}
				defaultValue={queryParams.related.toString()}
			/>
			<p>検索結果: {results.length}件</p>
			<div className="max-w-xl">
				<ResultTable
					headers={["Keywords"]}
					rows={
						results.map(
							(result) => (<SuggestResultRow name={result.name} />)
						)
					}
				/>
			</div>
		</>
	);
}
