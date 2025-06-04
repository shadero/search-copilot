import ResultTable from "./components/ResultTable";
import SearchBar from "./components/SearchBar";
import { useEffect, useState } from "react";
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { FetchHashtags, type HashtagData } from "./note-api/searches";
import OptionSelectBox from "./components/OptionSelectBox";
import { FetchRelatedHashtags, type RelatedHashtag } from "./note-api/hashtags";
import Template from "./components/Template";

type SuggestKeywordResult = {
	name: string,
};

function SuggestResultRow({ name }: SuggestKeywordResult) {
	return (
		<>
			<td>{name}</td>
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
	const [results, setResults] = useState<SuggestKeywordResult[]>([]);

	function hashtagData2Result(data: HashtagData): SuggestKeywordResult[] {
		return data.contents.map(content => ({ name: content.name }));
	}

	function relatedHashtag2Result(data: RelatedHashtag[]): SuggestKeywordResult[] {
		return data.map(content => ({ name: content.name }));
	}

	const handleSearch = (query: string) => {
		setQueryParams({ query: query.trim() });
	};

	useEffect(() => {
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

	function MainContent() {
		return (
			<>
				<SearchBar initialQuery={queryParams.query} onSearch={handleSearch} />
				<OptionSelectBox
					name="表示件数"
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
					name="キーワードの種類"
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

	return (
		<>
			<Template body={<MainContent />}></Template>
		</>
	);
}
