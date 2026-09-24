import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { logoutUser } from "../redux/authSlice";
import { useTheme } from "../utils/ThemeContext";
import logo from "../assets/logo.png";
import { Home, BriefcaseBusiness, Plus, MessageCircle, X, Menu, User, Settings, CircleHelp, LogOut, Bell } from "lucide-react";

const STUDENT_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { to: "/my-jobs", label: "My Jobs", icon: BriefcaseBusiness },
  { to: "/messages", label: "Messages", icon: MessageCircle },
];

const RECRUITER_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/admin/jobs/post", label: "Post Job", icon: Plus },
  { to: "/admin/jobs", label: "My Posted Jobs", icon: BriefcaseBusiness },
  { to: "/messages", label: "Messages", icon: MessageCircle },
];

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/pending-jobs", label: "Pending Jobs", icon: BriefcaseBusiness },
];

const menuLinksFor = (isEmployer) => [
  ...(isEmployer
    ? [{ to: "/company/register", label: "Company Details", icon: Plus }]
    : [{ to: "/profile", label: "Profile", icon: User }]),
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: CircleHelp },
];

const ADMIN_MENU_LINKS = [
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/help", label: "Help", icon: CircleHelp },
];

const LinkList = ({ links, size = "text-base", onClick }) =>
  links.map((l) => {
    const Icon = l.icon;
    return (
      <Link key={l.to} to={l.to} onClick={onClick} className={`flex items-center gap-1.5 ${size}`}>
        <Icon size={16} strokeWidth={1.8} /> {l.label}
      </Link>
    );
  });

// Avatar showing profile photo or initial
const Avatar = ({ user, size = "h-9 w-9", text = "text-sm" }) => {
  const initial = (user?.fullname || user?.email || "?").trim().charAt(0).toUpperCase();
  const photo = user?.profile?.profilePhoto;
  return (
    <div className={`${size} ${text} rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-semibold shrink-0 overflow-hidden`}>
      {photo ? (
        <img src={photo} alt={user?.fullname || "Profile"} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
};

// Bell icon for notification
const NotificationBell = ({ unreadCount, size = 24 }) => (
  <Link to="/notifications" aria-label="Notifications" className="relative inline-flex items-center">
    <Bell size={size} strokeWidth={1.8} />
    {unreadCount > 0 && (
      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </Link>
);

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isEmployer = user?.role === "recruiter";
  const isAdmin = user?.role === "admin";
  const navLinks = isAdmin ? ADMIN_LINKS : isEmployer ? RECRUITER_LINKS : STUDENT_LINKS;
  const menuLinks = isAdmin ? ADMIN_MENU_LINKS : menuLinksFor(isEmployer);

  const fetchUnreadCount = async () => {
    try {
      const res = await axiosInstance.get("/notification/get");
      if (res.data.success) {
        setUnreadCount(res.data.notifications.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  const logoutHandler = async () => {
    try {
      setLoggingOut(true);
      const wasAdmin = isAdmin;
      await axiosInstance.get("/user/logout");
      dispatch(logoutUser());
      navigate(wasAdmin ? "/admin/login" : "/login");
    } catch (e) {
      console.log(e);
    } finally {
      setLoggingOut(false);
      setConfirmLogout(false);
      setDropdownOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="relative flex items-center px-4 sm:px-8 h-20 shadow-md bg-[#F4F4F5] dark:bg-[#1a1a1d] text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img src={logo} alt="Job Portal Logo" className="h-14 sm:h-25 w-auto" />
      </Link>

      <div className="hidden lg:flex items-center gap-10 ml-auto">
        {user && <LinkList links={navLinks} />}
        <button onClick={() => setDarkMode(!darkMode)} className="text-base px-3 py-1 rounded border border-gray-600">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="bg-[#8B5CF6] text-white px-4 py-1.5 rounded">Register</Link>
          </>
        )}
      </div>

      {user && (
        <div className="hidden lg:flex items-center gap-5 ml-6">
          <NotificationBell unreadCount={unreadCount} />

          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="Profile menu">
              <Avatar user={user} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-60 flex flex-col py-2 rounded-lg shadow-lg bg-white dark:bg-[#242426] border border-gray-200 dark:border-gray-700 z-50">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <Avatar user={user} size="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user?.fullname}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                {menuLinks.length > 0 && (
                  <div className="flex flex-col gap-1 py-2">
                    <LinkList links={menuLinks} size="text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setDropdownOpen(false)} />
                  </div>
                )}
                <button onClick={() => setConfirmLogout(true)} className="flex items-center gap-2 text-sm px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-left">
                  <LogOut size={16} strokeWidth={1.8} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="lg:hidden h-10 w-10 ml-auto flex items-center gap-3">
        {user && <NotificationBell unreadCount={unreadCount} size={20} />}
        {user && <Avatar user={user} size="h-8 w-8" text="text-xs" />}
        {menuOpen ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
      </button>

      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setMenuOpen(false)} 
          />
          <div className="absolute top-20 left-0 w-full flex flex-col shadow-xl lg:hidden bg-white dark:bg-[#1a1a1d] border-b border-gray-200 dark:border-gray-700 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {user && (
              <div className="flex items-center gap-3 px-5 py-4 bg-[#F4F4F5] dark:bg-[#242426] border-b border-gray-200 dark:border-gray-700">
                <Avatar user={user} size="h-11 w-11" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.fullname}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col px-3 py-3 gap-1">
              {user ? (
                <>
                  {navLinks.map((l) => {
                    const Icon = l.icon;
                    return (
                      <Link 
                        key={l.to} 
                        to={l.to} 
                        onClick={() => setMenuOpen(false)} 
                        className="flex items-center gap-3 text-sm font-medium px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <Icon size={20} strokeWidth={1.8} className="text-[#8B5CF6]" /> {l.label}
                      </Link>
                    );
                  })}

                  {menuLinks.length > 0 && (
                    <>
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                      {menuLinks.map((l) => {
                        const Icon = l.icon;
                        return (
                          <Link 
                            key={l.to} 
                            to={l.to} 
                            onClick={() => setMenuOpen(false)} 
                            className="flex items-center gap-3 text-sm font-medium px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            <Icon size={20} strokeWidth={1.8} className="text-[#8B5CF6]" /> {l.label}
                          </Link>
                        );
                      })}
                    </>
                  )}

                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                  <button 
                    onClick={() => setDarkMode(!darkMode)} 
                    className="flex items-center gap-3 text-sm font-medium px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                  >
                    {darkMode ? "☀️" : "🌙"} {darkMode ? "Light mode" : "Dark mode"}
                  </button>

                  <button 
                    onClick={() => setConfirmLogout(true)} 
                    className="flex items-center gap-3 text-sm font-medium px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-left"
                  >
                    <LogOut size={20} strokeWidth={1.8} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-2 py-2">
                  <button 
                    onClick={() => setDarkMode(!darkMode)} 
                    className="text-sm px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-left"
                  >
                    {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
                  </button>
                  <Link 
                    to="/login" 
                    onClick={() => setMenuOpen(false)} 
                    className="text-sm font-medium px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-center"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMenuOpen(false)} 
                    className="text-sm font-medium px-3 py-2.5 rounded-lg bg-[#8B5CF6] text-white text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {confirmLogout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#242426] rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border border-gray-200 dark:border-gray-700 animate-[fadeIn_0.15s_ease-out]">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
              <LogOut size={24} strokeWidth={1.8} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold mb-1">Log out?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmLogout(false)} 
                disabled={loggingOut} 
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={logoutHandler} 
                disabled={loggingOut} 
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Logging out
                  </>
                ) : (
                  "Log out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
