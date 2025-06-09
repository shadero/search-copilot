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
import { Link } from "react-router-dom";

type SuggestKeywordResult = {
	name: string,
	count?: number
};

function SuggestResultRow({ name, count, queryParams }: { name: string, count?: number, queryParams: SuggestPageQuery }) {
	const serialize = createSerializer(SearchPageQueryModel);
	return (
		<>
			<td>{name}</td>
			<td>{count ?? "N/A"}</td>
			<td>
				<Link
					className="btn btn-sm"
					to={{
						pathname: "/search",
						search: serialize({
							query: name,
							service: queryParams.service,
							size: queryParams.size,
						}),
					}
					}> 🔎
				</Link>
			</td>
		</>
	);
}
type SuggestPageQuery = {
	service: (typeof Services)[number];
	query: string;
	size: number;
	related: boolean;
};

export default function SuggestKeywordsPage() {
	const noteBaseUrl = import.meta.env.VITE_NOTE_BASE_URL as string;
	const googleBaseUrl = import.meta.env.VITE_GOOGLE_BASE_URL as string;
	const [queryParams, setQueryParams] = useQueryStates(
		{
			service: parseAsStringLiteral(Services).withDefault("Note"),
			query: parseAsString.withDefault(""),
			size: parseAsInteger.withDefault(25),
			related: parseAsBoolean.withDefault(false),
		},
		{ history: "push" }
	);
	const [results, setResults] = useState<SuggestKeywordResult[]>([]);

	type CalcResultParam = {
		keywords: string;
		count?: number;
	};

	function CalcResult(param: CalcResultParam[]): SuggestKeywordResult[] {
		return param.map(v => ({ name: v.keywords, count: v.count }));
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
			if (queryParams.service == "Note" && queryParams.query.startsWith("#")) {
				setQueryParams({ query: queryParams.query.slice(1) });
				return;
			}
			results.length = 0;

			try {
				if (queryParams.service === "Google") {
					const data = await fetchSuggestions(googleBaseUrl, queryParams.query, queryParams.size);
					setResults(CalcResult(data.map((t) => ({ keywords: t }))));
				} else {
					if (queryParams.related) {
						const hashtags = await FetchRelatedHashtags(noteBaseUrl, queryParams.query);
						setResults(CalcResult(hashtags.map((t) => ({ keywords: t.name, count: t.count }))));
					} else {
						const hashtags = await FetchHashtags(noteBaseUrl, queryParams.query, queryParams.size);
						setResults(CalcResult(hashtags.map((t) => ({ keywords: t.name, count: t.count }))));
					}
				}
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
				<h1 className="text-2xl font-bold mb-4">キーワードサジェスト</h1>
				<p className="mb-4" >キーワードを入力すると、キーワードやハッシュタグのサジェストを表示します。</p>
				<SearchBar initialQuery={queryParams.query} onSearch={handleSearch} />
				<ServiceSwitch displayServices={Services} service={queryParams.service} setService={(s) => setQueryParams({ service: s })} />
				<Options />
				<div className="divider"></div>
				<p>検索結果: {results.length}件</p>
				<div className="max-w-xl">
					<ResultTable
						headers={["キーワード", "記事数", "検索"]}
						rows={
							results.map(
								(result) => (<SuggestResultRow name={result.name} count={result.count} queryParams={queryParams} />)
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
