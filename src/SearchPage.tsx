import { useEffect, useState } from "react";
import FetchSearchNotes, { SEARCH_SORTS, type SearchSort } from './note-api/searches';
import SearchBar from "./components/SearchBar";
import ResultTable from "./components/ResultTable";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import OptionSelectBox from "./components/OptionSelectBox";
import Template from "./components/Template";
import FetchNotesByHashtag from "./note-api/searchNotesByHashtag";
import ServiceSwitch, { Services } from "./components/ServiceSwitch";

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
	queryParam: { query: string, sort: SearchSort, size: number },
	setQueryParam: (params: Partial<{ query: string, sort: SearchSort, size: number }>) => void
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
		</div>
	);
}

export const SearchPageQueryModel = {
	service: parseAsStringLiteral(Services).withDefault("Note"),
	query: parseAsString.withDefault(""),
	sort: parseAsStringLiteral(SEARCH_SORTS).withDefault("popular"),
	size: parseAsInteger.withDefault(10),
};

export default function SearchPage() {
	const baseUrl = 'http://localhost:8080/https://note.com';
	const [queryParam, setQueryParam] = useQueryStates(SearchPageQueryModel, { history: "push" });
	const [results, setResults] = useState<SearchResult[]>([]);

	async function fetchResults(
		query: string,
		sort: SearchSort = "popular",
		size: number = 10
	): Promise<SearchResult[]> {
		console.log(`Fetching search results for query: ${query}`);

		// ハッシュタグ検索
		if (query.startsWith("#")) {
			const hashtag = query.slice(1);
			const result = FetchNotesByHashtag(baseUrl, hashtag, sort)
				.then(data => {
					return data.data.notes.map(
						note => {
							const url = `https://note.com/${note.user.urlname}/n/${note.key}`;
							return { name: note.name, url: url } as SearchResult;
						}
					);
				}).catch(error => {
					console.error("Error fetching hashtag search results:", error);
					return [];
				});
			return result;
		}

		// 通常のキーワード検索
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
