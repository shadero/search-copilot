import { Link } from "react-router-dom";
import Template from "./components/Template";

function MainContent() {
	return (
		<div>
			<div>
				<h1 className="text-4xl font-bold mb-4">ようこそ</h1>
				<p className="text-lg">このアプリは、SEO対策向けの検索支援ツールです。</p>
				<p className="text-lg  mb-6">Googleやnoteの検索結果、サジェストを表形式で整理・表示することができます。</p>
				<div className="flex gap-4 flex-wrap">
					<Link to="/search" className="btn btn-primary">記事検索</Link>
					<Link to="/suggestKeywords" className="btn btn-primary">キーワードサジェスト</Link>
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