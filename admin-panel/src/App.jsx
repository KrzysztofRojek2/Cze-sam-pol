import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./App.css"
import AdminHome from "./components/AdminHome/AdminHome"
import AdminCars from "./components/AdminCars/AdminCars"
import AdminProducts from "./components/AdminProducts/AdminProducts"
import LoginPanel from "./components/loginPanel/LoginPanel"
import AdminBrands from "./components/AdminBrands/AdminBrands"
import AdminTransactions from "./components/AdminTransactions/AdminTransactions"
import AdminTransactionsMenu from "./components/AdminTransactionsMenu/AdminTransactionsMenu"
import AdminTransactionsOngoing from "./components/AdminTransactionsOngoing/AdminTransactionsOngoing"
import RegisterPanel from "./components/registerPanel/RegisterPanel"
import Users from "./components/Users/Users"
import AdminReturnsMenu from "./components/AdminReturnsMenu/AdminReturnsMenu"
import AdminReportsMenu from "./components/AdminReportsMenu/AdminReportsMenu"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPanel />}></Route>
        <Route path="/register" element={<RegisterPanel />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/home" element={<AdminHome />}></Route>
        <Route path="/admin-cars" element={<AdminCars />}></Route>
        <Route path="/admin-products" element={<AdminProducts />}></Route>
        <Route path="/admin-brands" element={<AdminBrands />}></Route>
        <Route path="/admin-transactions" element={<AdminTransactions />} />
        <Route
          path="/admin-transactions/awaiting"
          element={<AdminTransactions />}
        />
        <Route
          path="/admin-transactions/approved"
          element={<AdminTransactions />}
        />
        <Route path="/returns" element={<AdminReturnsMenu />} />
        <Route path="/reports" element={<AdminReportsMenu />} />
        <Route
          path="/admin-transactions-menu"
          element={<AdminTransactionsMenu />}
        />
        <Route
          path="/admin-transactions-ongoing"
          element={<AdminTransactionsOngoing />}
        />
      </Routes>
    </Router>
  )
}

export default App
