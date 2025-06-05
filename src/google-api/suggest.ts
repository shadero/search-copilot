import axios from "axios";
import { XMLParser } from "fast-xml-parser";

type Suggestion = {
	data: string;
};

const parser = new XMLParser({
	ignoreDeclaration: true,
	ignoreAttributes: false, // attributeが自動で削除される設定になっているのでオフに
	numberParseOptions: { // 数字の場合、0が消えてしまうので設定追加
		leadingZeros: false,
		hex: false,
	},
});
export async function fetchSuggestions(
	baseUrl: string,
	query: string,
	hl: string = "ja"
): Promise<string[]> {
	const url = `${baseUrl}/complete/search?output=toolbar&hl=${hl}&q=${query}`;
	try {
		const ax = axios.create({
			transformResponse: [(data) => {
				return parser.parse(data);
			}],
		});
		
		return ax.get(url).then(response => {
			return response.data.toplevel.CompleteSuggestion.map(
				(item: any) => {
					return item.suggestion["@_data"];
				}
			);
		});
	} catch (error) {
		console.error("Error fetching suggestions:", error);
		throw error;
	}
}