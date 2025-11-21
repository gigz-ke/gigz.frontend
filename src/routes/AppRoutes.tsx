// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import { CreateUserForm } from "../components/auth/CreateUserForm";
import LoginPage from "../pages/LoginPage";
import { ProfileSettings } from "../pages/ProfileSettingsPage";
import { CategoryList } from "../components/categories/CategoryList";
import { AddCategoryPage } from "../pages/AddCategoryPage";
import { EditCategoryPage } from "../pages/EditCategoryPage";
import { GigListPage } from "../pages/GigListPage";
import { AddGigPage } from "../pages/AddGigPage";
import { EditGigPage } from "../pages/EditGigPage";
import { GigDetailsPage } from "../pages/GigDetailsPage";
import { OrderListPage } from "../pages/OrderListPage";
import CategoryGigsPage from "../pages/CategoryGigsPage";
import GigzWorkHubPage from "../pages/GigzWorkHubPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<CreateUserForm />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<ProfileSettings />} />
      <Route path="/categories" element={<CategoryList />} />
      <Route path="/categories/add" element={<AddCategoryPage />} />
      <Route path="/categories/edit/:id" element={<EditCategoryPage />} />
       <Route path="/categories/:id/gigs" element={<CategoryGigsPage />} />
      <Route path="/gigs" element={<GigListPage />} />
      <Route path="/gigs/add" element={<AddGigPage />} />
      <Route path="/gigs/edit/:gigId" element={<EditGigPage />} />
      <Route path="/gigs/:id" element={<GigDetailsPage />} />
      <Route path="/gigs/hub" element={<GigzWorkHubPage />} />
      <Route path="/orders" element={<OrderListPage />} />
    </Routes>
  );
};

export default AppRoutes;
