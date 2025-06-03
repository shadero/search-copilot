import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import App from "../App";
import SearchPage from "../SearchPage";
import SuggestKeywordsPage from "../SuggestKeywordsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/suggestKeywords' element={<SuggestKeywordsPage />} />
      </Routes>
    </BrowserRouter>
  )
}