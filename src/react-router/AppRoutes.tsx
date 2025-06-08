import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";
import SearchPage from "../SearchPage";
import SuggestKeywordsPage from "../SuggestKeywordsPage";
import TopPage from "../TopPage";

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<TopPage />} />
				<Route path='/search' element={<SearchPage />} />
				<Route path='/suggestKeywords' element={<SuggestKeywordsPage />} />
			</Routes>
		</BrowserRouter>
	)
}