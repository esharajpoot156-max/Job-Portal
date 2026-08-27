import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import MyJobs from "./pages/MyJobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import AdminJobs from "./pages/AdminJobs";
import Applicants from "./pages/Applicants";
import Conversations from "./pages/Conversations";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import CompanyRegister from "./pages/CompanyRegister";
import AdminPendingJobs from "./pages/AdminPendingJobs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SettingsPage from "./pages/SettingPage";
import HelpPage from "./pages/Help";
import Footer from "./components/Footer";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="flex flex-col min-h-screen" >
      <Navbar />
      <div className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/jobs/post" element={<PostJob />} />
        <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
        <Route path="/messages" element={<Conversations />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/admin/pending-jobs" element={<AdminPendingJobs />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
      </div>
      <Footer/>
    </div>
    </>
  );
}

export default App;