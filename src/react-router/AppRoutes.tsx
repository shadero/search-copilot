import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import App from "../App";
import SearchPage from "../SearchPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/search' element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;