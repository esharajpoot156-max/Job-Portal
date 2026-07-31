import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
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

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/jobs/post" element={<PostJob />} />
        <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
        <Route path="/messages" element={<Conversations />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/admin/pending-jobs" element={<AdminPendingJobs />} />
      </Routes>
    </>
  );
}

export default App;