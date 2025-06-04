import axios from "axios";

// ChatGPTを使ってAPIの型定義を生成しました。
// 未使用の変数の型はあまり確認していないので、注意してください。
type SearchesResponseModel = {
  data: {
    notes: NotesData;
    magazines: Record<string, unknown>;
    users: Record<string, unknown>;
    hashtags: HashtagData;
    circles: Record<string, unknown>;
    cursor: CursorData;
  };
};

type NotesData = {
  is_last_page: boolean | null;
  contents: Note[];
  top_search_contents: any[]; // 型が不明なため any にしています
  total_count: number;
  rounded_total_count: number;
};

type Note = {
  id: number;
  type: string;
  status: string;
  name: string;
  description: string | null;
  price: number;
  key: string;
  slug: string;
  publish_at: string;
  thumbnail_external_url: string;
  eyecatch: string;
  user: User;
  can_read: boolean;
  is_author: boolean;
  external_url: string | null;
  custom_domain: string | null;
  body: string;
  separator: string;
  is_limited: boolean;
  is_trial: boolean;
  can_update: boolean;
  tweet_text: string;
  is_refund: boolean;
  highlight: string;
  eyecatch_type_2: string | null;
  sp_eyecatch: string;
  category: string | null;
  comment_count: number;
  like_count: number;
  is_liked: boolean;
  is_included_private_purchase_magazine: boolean;
  image_count: number;
  format: string;
  audio: Record<string, unknown>;
  is_membership_connected: boolean;
  has_available_circle_plans: boolean;
  discount_campaigns: any[]; // 型が不明なため any にしています
  pictures: any[]; // 型が不明なため any にしています
  price_info: PriceInfo;
};

type HashtagData = {
  is_last_page: boolean | null;
  contents: Hashtag[];
  top_search_contents: any[]; // 検索上位の構造が不明なので any[]
  total_count: number;
  rounded_total_count: number;
};

type Hashtag = {
  id: number;
  name: string;
  count: number;
};

type User = {
  id: number;
  key: string;
  name: string;
  urlname: string;
  nickname: string;
  user_profile_image_path: string;
  custom_domain: string | null;
  disable_support: boolean;
  email_confirmed_flag: boolean;
  like_appeal_text: string;
  like_appeal_image: string | null;
  twitter_nickname: string | null;
  magazine_add_appeal: {
    text: string | null;
    image: string | null;
  };
};

type PriceInfo = {
  is_free: boolean;
  has_multiple: boolean;
  has_subscription: boolean;
  oneshot_lowest_price: number | null;
};

type CursorData = {
  note: string;
  magazine: string;
  user: string;
  hashtag: string;
  circle: string;
  note_for_sale: string;
};

export const SEARCH_SORTS = ['popular', 'hot', 'new'] as const;
export type SearchSort = typeof SEARCH_SORTS[number];
const baseUrl = 'http://localhost:8080/https://note.com';

async function FetchSearchNotes(
  query: string,
  sort: SearchSort = 'popular',
  size: number = 10,
  start: number = 0
): Promise<NotesData> {
  const result = await axios.get<SearchesResponseModel>(
    `${baseUrl}/api/v3/searches?context=note&q=${query}&size=${size}&start=${start}&sort=${sort}`
  );
  if (result.status !== 200) {
    throw new Error(`Failed to fetch notes: ${result.statusText}`);
  }

  return result.data.data.notes;
}

export async function FetchHashtags(query: string, size: number = 10, start: number = 0): Promise<HashtagData> {
  const result = await axios.get<SearchesResponseModel>(
    `${baseUrl}/api/v3/searches?context=hashtag&q=${query}&size=${size}&start=${start}`
  );
  if (result.status !== 200) {
    throw new Error(`Failed to fetch hashtags: ${result.statusText}`);
  }
  return result.data.data.hashtags;
}

export default FetchSearchNotes;