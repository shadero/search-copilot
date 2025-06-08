import { useEffect, useState } from "react";
import FetchNotesByKeyword, { GetNoteUrl, SEARCH_SORTS, type SearchSort } from './note-api/searches';
import SearchBar from "./components/SearchBar";
import ResultTable from "./components/ResultTable";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import OptionSelectBox from "./components/OptionSelectBox";
import Template from "./components/Template";
import FetchNotesByHashtag from "./note-api/searchNotesByHashtag";
import ServiceSwitch, { Services } from "./components/ServiceSwitch";
import { FetchSearchResults } from "./google-scrape-api/scrape";

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

function SearchOptions({ queryParam, setQueryParam }: {
	queryParam: SearchPageQuery,
	setQueryParam: (params: Partial<SearchPageQuery>) => void
}) {
	return (
		<div className="flex gap-4 items-end">
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
			{queryParam.service == "Note" && <OptionSelectBox
				name="ソート"
				map={{
					[SEARCH_SORTS[0]]: "人気順",
					[SEARCH_SORTS[1]]: "ホット順",
					[SEARCH_SORTS[2]]: "新着順",
				}}
				onChange={(e) => { setQueryParam({ sort: e.target.value as SearchSort }); }}
				defaultValue={queryParam.sort}
			/>}
		</div>
	);
}

export type SearchPageQuery = {
	service: typeof Services[number];
	query: string;
	sort: SearchSort;
	size: number;
};

export const SearchPageQueryModel = {
	service: parseAsStringLiteral(Services).withDefault("Note"),
	query: parseAsString.withDefault(""),
	sort: parseAsStringLiteral(SEARCH_SORTS).withDefault("popular"),
	size: parseAsInteger.withDefault(10),
};

export default function SearchPage() {
	const googleScrapeApiUrl = import.meta.env.VITE_GOOGLE_SCRAPE_API_URL as string;
	const noteApiBaseUrl = import.meta.env.VITE_NOTE_BASE_URL as string;
	const [queryParam, setQueryParam] = useQueryStates(SearchPageQueryModel, { history: "push" });
	const [results, setResults] = useState<SearchResult[]>([]);

	async function fetchResults(
		query: string,
		sort: SearchSort = "popular",
		size: number = 10
	): Promise<SearchResult[]> {
		console.log(`Fetching search results for query: ${query}`);

		if (queryParam.service == "Google") {
			const result = FetchSearchResults(googleScrapeApiUrl, query, size)
				.then(data => {
					return data.map(
						item => {
							return { name: item.title, url: item.url } as SearchResult;
						}
					);
				}).catch(error => {
					console.error("Error fetching Google search results:", error);
					return [];
				});
			return result;
		}

		// ハッシュタグ検索
		if (query.startsWith("#")) {
			const hashtag = query.slice(1);
			const result = FetchNotesByHashtag(noteApiBaseUrl, hashtag, sort, size)
				.then(notes => {
					return notes.map(
						note => { return { name: note.name, url: GetNoteUrl(note) } as SearchResult; }
					);
				}).catch(error => {
					console.error("Error fetching hashtag search results:", error);
					return [];
				});
			return result;
		}

		// 通常のキーワード検索
		const result = FetchNotesByKeyword(noteApiBaseUrl, query, sort, size)
			.then(notes => {
				return notes.map(
					note => { return { name: note.name, url: GetNoteUrl(note) } as SearchResult; }
				);
			}).catch(error => {
				console.error("Error fetching search results:", error);
				return [];
			});
		return result;
	}

	const handleSubmit = (query: string) => {
		setQueryParam({ query: query.trim() });
	};

	useEffect(() => {
		fetchResults(queryParam.query, queryParam.sort!, queryParam.size).then(setResults);
	}, [queryParam]);

	function MainContent() {
		return (
			<>
				<SearchBar initialQuery={queryParam.query} onSearch={handleSubmit} />
				<ServiceSwitch displayServices={Services} service={queryParam.service} setService={(s) => setQueryParam({ service: s })} />
				<SearchOptions queryParam={queryParam} setQueryParam={setQueryParam} />
				<div className="divider"></div>
				<p>検索結果: {results.length}件</p>
				<div className="max-w-3xl">
					<ResultTable
						headers={["Name", "URL"]}
						rows={
							results.map((result) => (
								<SearchResultRow key={result.url} name={result.name} url={result.url} />
							))
						}
					/>
				</div>
			</>
		);
	}

	return (
		<Template body={<MainContent />} />
	);
}
