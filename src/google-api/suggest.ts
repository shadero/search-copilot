import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export async function fetchSuggestions(baseUrl: string, query: string, size: number, hl: string = "ja",): Promise<string[]> {
	type Suggestion = { suggestion: string; depth: number };
	const suggestions: Suggestion[] = [];
	let depth = 1;

	// 初回クエリ
	let queue = await fetchSuggestionsInternal(baseUrl, query, hl);
	suggestions.push(...queue.map(s => ({ suggestion: s, depth })));

	while (suggestions.length < size) {
		const currentLevel = suggestions.filter(s => s.depth === depth).map(s => s.suggestion);
		if (currentLevel.length === 0) break;
		depth++;

		for (const q of currentLevel) {
			if (suggestions.length >= size) break;
			const fetched = await fetchSuggestionsInternal(baseUrl, q, hl);
			fetched
				.filter(s => !suggestions.some(item => item.suggestion === s))
				.forEach(s => suggestions.push({ suggestion: s, depth }));
		}
	}

	return suggestions.slice(0, Math.min(size, suggestions.length)).map(s => s.suggestion);
}

const parser = new XMLParser({
	ignoreDeclaration: true,
	ignoreAttributes: false, // attributeが自動で削除される設定になっているのでオフに
	numberParseOptions: { // 数字の場合、0が消えてしまうので設定追加
		leadingZeros: false,
		hex: false,
	},
});

async function fetchSuggestionsInternal(baseUrl: string, query: string, hl: string = "ja"): Promise<string[]> {
	const url = `${baseUrl}/complete/search?output=toolbar&hl=${hl}&q=${encodeURIComponent(query)}`;

	const ax = axios.create({
		transformResponse: [(data) => {
			return parser.parse(data);
		}],
	});

	return ax.get(url).then(response => {
		if (response.status !== 200) {
			throw new Error(`Error fetching suggestions: ${response.statusText}`);
		}
		if (!response.data.toplevel.CompleteSuggestion) {
			return [];
		}
		const suggestionsArray = Array.isArray(response.data.toplevel.CompleteSuggestion)
			? response.data.toplevel.CompleteSuggestion
			: [response.data.toplevel.CompleteSuggestion];
		return suggestionsArray.map(
			(item: any) => {
				return item.suggestion["@_data"];
			}
		);
	});
}