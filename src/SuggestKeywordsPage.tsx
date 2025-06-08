import ResultTable from "./components/ResultTable";
import SearchBar from "./components/SearchBar";
import { useEffect, useState } from "react";
import { createSerializer, parseAsBoolean, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { FetchHashtags } from "./note-api/searches";
import OptionSelectBox from "./components/OptionSelectBox";
import { FetchRelatedHashtags } from "./note-api/hashtags";
import Template from "./components/Template";
import { SearchPageQueryModel } from "./SearchPage";
import ServiceSwitch, { Services } from "./components/ServiceSwitch";
import { fetchSuggestions } from "./google-api/suggest";

type SuggestKeywordResult = {
	name: string,
	url: string
};

function SuggestResultRow({ name, url }: SuggestKeywordResult) {
	return (
		<>
			<td>{name}</td>
			<td><a className="btn btn-sm" href={url}>🔎</a></td>
		</>
	);
}

export default function SuggestKeywordsPage() {
	const noteBaseUrl = import.meta.env.VITE_NOTE_BASE_URL as string;
	const googleBaseUrl = import.meta.env.VITE_GOOGLE_BASE_URL as string;
	const [queryParams, setQueryParams] = useQueryStates(
		{
			service: parseAsStringLiteral(Services).withDefault("Note"),
			query: parseAsString.withDefault(""),
			size: parseAsInteger.withDefault(10),
			related: parseAsBoolean.withDefault(false),
		},
		{ history: "push" }
	);
	const [results, setResults] = useState<SuggestKeywordResult[]>([]);

	function CalcResult(keywords: string[]): SuggestKeywordResult[] {
		return keywords.map(keyword => {
			const serialize = createSerializer(SearchPageQueryModel);
			const url = serialize("/search", {
				query: keyword,
				size: queryParams.size,
			});
			return { name: keyword, url: url };
		});
	}

	function Options() {
		return (
			<div className="flex gap-4 items-end">
				{!(queryParams.service == "Note" && queryParams.related == true) &&
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
				}

				{/* Note Only */}
				{queryParams.service == "Note" &&
					<OptionSelectBox
						name="ハッシュタグの種類"
						map={{
							false: "サジェストハッシュタグ",
							true: "関連ハッシュタグ",
						}}
						onChange={(e) => { setQueryParams({ related: e.target.value === "true" }); }}
						defaultValue={queryParams.related.toString()}
					/>
				}
			</div>
		);
	}

	const handleSearch = (query: string) => {
		setQueryParams({ query: query.trim() });
	};

	useEffect(() => {
		async function fetchKeywords() {
			try {
				let keywords: string[] = [];
				if (queryParams.service === "Google") {
					keywords = await fetchSuggestions(googleBaseUrl, queryParams.query);
				} else if (queryParams.related) {
					const data = await FetchRelatedHashtags(noteBaseUrl, queryParams.query);
					keywords = data.map(c => c.name);
				} else {
					const hashtags = await FetchHashtags(noteBaseUrl, queryParams.query, queryParams.size);
					keywords = hashtags.map(t => t.name);
				}
				setResults(CalcResult(keywords));
			} catch {
				console.log("Error fetching keywords");
				
				setResults([]);
			}
		}
		fetchKeywords();

		
	}, [queryParams]);

	function MainContent() {
		return (
			<>
				<SearchBar initialQuery={queryParams.query} onSearch={handleSearch} />
				<ServiceSwitch displayServices={Services} service={queryParams.service} setService={(s) => setQueryParams({ service: s })} />
				<Options />
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
