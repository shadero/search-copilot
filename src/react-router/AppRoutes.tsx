import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import App from "../App";
import Search from "../Search";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;