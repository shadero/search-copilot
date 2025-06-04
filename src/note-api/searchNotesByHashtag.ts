import axios from "axios";
import type { SearchSort } from "./searches";

// ChatGPTを使ってAPIの型定義を生成しました。
// 未使用の変数の型はあまり確認していないので、注意してください。
type User = {
  key: string;
  name: string;
  urlname: string;
  nickname: string;
  user_profile_image_url: string;
  custom_domain: string | null;
};

type Note = {
  type: string;
  status: string;
  name: string;
  description: string | null;
  price: number;
  can_read_note_all: boolean;
  key: string;
  publish_at: string; // ISO 8601形式の日付文字列
  thumbnail_external_url: string;
  body: string;
  eyecatch_url: string;
  sp_eyecatch_url: string;
  user: User;
  audio: string | null;
  pictures: any[]; // 詳細な構造が不明なのでany
  external_url: string | null;
  like_count: number;
  is_liked: boolean;
  custom_domain: string | null;
  prior_sale: any | null; // 詳細不明
  is_limited: boolean;
  separator: string | null;
  is_author: boolean;
  discount_campaigns: any[]; // 詳細不明
};

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
  page: number = 1,
  paidOnly: boolean = false
): Promise<NotesApiResponseModel> {
  const url = `${baseUrl}/api/v3/hashtags/${hashtag}/notes?order=${sort}&page=${page}&paid_only=${paidOnly}`;
  
  try {
	const response = await axios.get<NotesApiResponseModel>(url);
	return response.data;
  } catch (error) {
	console.error("Error fetching notes by hashtag:", error);
	throw error;
  }
}