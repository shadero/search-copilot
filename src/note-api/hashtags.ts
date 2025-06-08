import axios from "axios";

// ChatGPTを使ってAPIの型定義を生成しました。
// 未使用の変数の型はあまり確認していないので、注意してください。
export type RelatedHashtag = {
	name: string;
	count: number;
};

type HashtagsResponseModel = {
	data: {
		id: number;
		name: string;
		count: number;
		relatedHashtags: RelatedHashtag[];
		relatedContests: any[]; // 要素の詳細が不明なためany型。詳細が分かれば具体的に指定可能。
		layoutInfraSectionKeys: any[]; // 同上。
	};
};

export async function FetchRelatedHashtags(baseUrl: string, query: string,): Promise<RelatedHashtag[]> {
	const url = `${baseUrl}/api/v2/hashtags/${(encodeURIComponent(query))}`;
	const response = await axios.get<HashtagsResponseModel>(url);
	return response.data.data.relatedHashtags;
}