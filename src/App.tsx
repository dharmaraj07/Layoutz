import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Index from "./pages/Index";
import PropertyEnquiry from "./pages/PropertyEnquiry";
import Properties from "./pages/Properties";
import Investor from "./pages/Investor";
import Contact from "./components/Contact";
import PropertyDetail from "./pages/PropertyDetail";
import Admin from "./pages/Admin";
import CustAdmin from "./pages/CustAdmin";
import AdminLogin from "./pages/AdminLogin";
import ScheduleVisit from "./components/ScheduleVisit";
import Enquiries from "./pages/Enquiries";
import CRM from "./pages/CRM";
import { FloatingContactButtons } from "./components/layout/FloatingContactButton";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import About from "./pages/About";
import Whatsapp from "./components/whatsapp";
import Enquire from "./pages/Enquire";

function App() {
  const { data: authUser, isLoading, isError } = useAuth();
  const location = useLocation();
      // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");
    
  return (
    <div>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/investor" element={<Investor />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/enquire/:propertyId" element={<Enquire />} />
        <Route path="/property-enquiry/:propertyId" element={<PropertyEnquiry />} />
        <Route path="/property/:title" element={<PropertyDetail />} />

        {/* ✅ Admin Login (not protected — handles redirect inside itself) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔐 Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/customer" element={<ProtectedRoute><CustAdmin /></ProtectedRoute>} />
        <Route path="/admin/enquiries" element={<ProtectedRoute><Enquiries /></ProtectedRoute>} />
        <Route path="/admin/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
        <Route path="/admin/visits" element={<ProtectedRoute><ScheduleVisit /></ProtectedRoute>} />
        <Route path="/admin/whatsapp" element={<ProtectedRoute><Whatsapp /></ProtectedRoute>} />

        {/* 404 */}
       <Route path="*" element={<About />} /> 
      </Routes>

      {/* 👇 Show only on public routes */}
      {!isAdminRoute && <FloatingContactButtons />}
    </div>
  );
}

export default App;
