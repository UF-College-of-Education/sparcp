import { useState } from "react";
import { Navigation } from "./components/Navigation";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
} from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import { LearningResources } from "./pages/LearningResources";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Training } from "./pages/Training";
import { Resources } from "./pages/Resources";

export default function App() {
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);

  const handleBackToDashboard = () => {
  };

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/dashboard" element={ <Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/training" element={<Training />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>      
  );
}