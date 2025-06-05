import ResultTable from "./components/ResultTable";
import SearchBar from "./components/SearchBar";
import { useEffect, useState } from "react";
import { createSerializer, parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { FetchHashtags, type HashtagData } from "./note-api/searches";
import OptionSelectBox from "./components/OptionSelectBox";
import { FetchRelatedHashtags, type RelatedHashtag } from "./note-api/hashtags";
import Template from "./components/Template";
import { SearchPageQueryModel } from "./SearchPage";

type SuggestKeywordResult = {
	name: string,
	url: string
};

function SuggestResultRow({ name, url }: SuggestKeywordResult) {
	return (
		<>
			<td>{name}</td>
			<td><a href={url}>🔎</a></td>
		</>
	);
}

function Options({ queryParams, setQueryParams }: {
	queryParams: { query: string, size: number, related: boolean },
	setQueryParams: (params: Partial<{ query: string, size: number, related: boolean }>) => void
}) {
	return (
		<div className="flex gap-4 items-end mt-4">
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
		</div>
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
		return data.contents.map(
			content => {
				const serialize = createSerializer(SearchPageQueryModel);
				const url = serialize("/search", {
					query: content.name.slice(1), // Remove the leading '#'
					size: queryParams.size,
				});
				return { name: content.name, url: url }
			}
		);
	}

	function relatedHashtag2Result(data: RelatedHashtag[]): SuggestKeywordResult[] {
		return data.map(content => {
			const serialize = createSerializer(SearchPageQueryModel);
			const url = serialize("/search", {
				query: content.name.slice(1), // Remove the leading '#'
				size: queryParams.size,
			});
			return { name: content.name, url: url };
		});
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
				<Options queryParams={queryParams} setQueryParams={setQueryParams} />
				<div className="divider"></div>
				<p>検索結果: {results.length}件</p>
				<div className="max-w-xl">
					<ResultTable
						headers={["Keyword", "検索"]}
						rows={
							results.map(
								(result) => (<SuggestResultRow name={result.name} url={result.url} />)
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
