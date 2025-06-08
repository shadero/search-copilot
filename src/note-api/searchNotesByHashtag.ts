import axios from "axios";
import type { Note, SearchSort } from "./searches";

type NotesApiResponseModel = {
	data: {
		notes: Note[];
		count: number;
		next_page: number | null;
		is_last_page: boolean;
	};
};

export default async function FetchNotesByHashtag(
	baseUrl: string,
	hashtag: string,
	sort: SearchSort = "popular",
	size: number,
	paidOnly: boolean = false
): Promise<Note[]> {

	const notes: Note[] = [];


	let page = 1;
	while (notes.length < size) {
		const url = `${baseUrl}/api/v3/hashtags/${hashtag}/notes?order=${sort}&page=${page}&paid_only=${paidOnly}`;
		const response = await axios.get<NotesApiResponseModel>(url);
		if (response.status !== 200) {
			throw new Error(`Error fetching notes: ${response.statusText}`);
		}
		const foundedNotes = response.data.data.notes;
		if (foundedNotes.length === 0) {
			break;
		}
		notes.push(...foundedNotes);

		const nextPage = response.data.data.next_page;
		if (nextPage === null) {
			break;
		}
		page = nextPage;
	}
	return notes.slice(0, Math.min(size, notes.length));
}