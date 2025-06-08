import axios from "axios";

export type GoogleSearchResult = {
	title: string;
	url: string;
	description: string;
};

export async function FetchSearchResults(
	baseUrl: string,
	query: string,
	size: number = 10
): Promise<GoogleSearchResult[]> {
	const url = `${baseUrl}?query=${encodeURIComponent(query)}&size=${size}`;

	return axios
		.get<GoogleSearchResult[]>(url, { timeout: 10000, })
		.then(response => {
			if (response.status !== 200) {
				throw new Error(`Error fetching search results: ${response.statusText}`);
			}
			return response.data;
		})
		.catch(error => { throw error; });
}