import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin/Admin";
import Dashboard from "./pages/Admin/dashboard";
import AdminStudent from "./pages/Admin/student";
import AdminCompanies from "./pages/Admin/recruiter"; // recruiter.jsx represents Companies management
import Recruiters from "./pages/Admin/recruiters";
import AdminDrives from "./pages/Admin/drives";
import AdminApplications from "./pages/Admin/applications";
import Reports from "./pages/Admin/reports";
import Notifications from "./pages/Admin/notifications";
import Profile from "./pages/Admin/profile";
import Recruiter from "./pages/recruiter/Recruiter";
import Student from "./pages/Student/student";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recruiter" element={<Recruiter />} />
      <Route path="/student" element={<Student />} />

      {/* Admin Routes with Header layout */}
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<AdminStudent />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="recruiters" element={<Recruiters />} />
        <Route path="drives" element={<AdminDrives />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
