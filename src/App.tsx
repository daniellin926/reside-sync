
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Renter pages
import RenterDashboard from "./pages/renter/RenterDashboard";
import CreateRequest from "./pages/renter/CreateRequest";
import RequestSubmitted from "./pages/renter/RequestSubmitted";
import RenterRequestDetail from "./pages/renter/RequestDetail";

// Landlord pages
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import LandlordRequestDetail from "./pages/landlord/RequestDetail";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequestDetail from "./pages/admin/RequestDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MaintenanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login/:portalType" element={<Login />} />
              
              {/* Renter routes */}
              <Route path="/renter" element={<RenterDashboard />} />
              <Route path="/renter/create-request" element={<CreateRequest />} />
              <Route path="/renter/request-submitted" element={<RequestSubmitted />} />
              <Route path="/renter/request/:requestId" element={<RenterRequestDetail />} />
              
              {/* Landlord routes */}
              <Route path="/landlord" element={<LandlordDashboard />} />
              <Route path="/landlord/request/:requestId" element={<LandlordRequestDetail />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/request/:requestId" element={<AdminRequestDetail />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MaintenanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
