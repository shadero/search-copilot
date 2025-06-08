import Template from "./components/Template";

function MainContent() {
	return (
		<div>
			<div>
				<h1 className="text-4xl font-bold mb-4">検索アプリへようこそ</h1>
				<p className="text-lg mb-6">検索バーを使ってノート、ハッシュタグ、Google検索結果を探せます。</p>
				<div className="flex gap-4 flex-wrap">

					<a href="/search" className="btn btn-primary">検索ページ</a>
					<a href="/suggestKeywords" className="btn btn-primary">キーワードサジェスト</a>
				</div>
			</div>
		</div>
	);
}


export default function TopPage() {
	return (
		<Template body={<MainContent />} />
	)
}