import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserMain } from "./pages/User/UserMain";
import { ShopOwnerMain } from "./pages/ShopOwner/ShopOwnerMain";
import { AuthProvider } from "./context/AuthContext";
import { CreateShop } from "./pages/ShopOwner/CreateShop";
import { MyShops } from "./pages/ShopOwner/MyShops";
import ShopDetailPage from "./pages/ShopOwner/ShopDetailPage";
import Reservation from "./pages/User/Reservation";
import MyReservations from "./pages/User/MyReservations";
import AdminMain from "./pages/Admin/AdminMain";
import { UsersControlPage } from "./pages/Admin/UsersControlPage";
import { ShopOwnerControlPage } from "./pages/Admin/ShopOwnerControlPage";
import UserDetails from "./pages/Admin/UserDetails";
import EditShop from "./pages/ShopOwner/EditShop";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-main-page" element={<AdminMain />} />
          <Route path="/admin-users-control" element={<UsersControlPage />} />
          <Route
            path="/admin-shopowner-control"
            element={<ShopOwnerControlPage />}
          />
          <Route
            path="/admin-user-information/:publicId"
            element={<UserDetails />}
          />

          <Route path="/user-main-page" element={<UserMain />} />
          <Route path="/user-reservation" element={<Reservation />} />
          <Route path="/user-myreservations" element={<MyReservations />} />
          <Route path="/shopowner-main-page" element={<ShopOwnerMain />} />
          <Route path="/shopowner-create-shop" element={<CreateShop />} />
          <Route
            path="/shopowner-myshops/edit/:shopId"
            element={<EditShop />}
          />
          <Route path="/shopowner-myshops" element={<MyShops />} />
          <Route path="/shopowner-myshops/:id" element={<ShopDetailPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
