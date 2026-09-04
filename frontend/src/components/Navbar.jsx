import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { logoutUser } from "../redux/authSlice";
import { useTheme } from "../utils/ThemeContext";
import logo from "../assets/logo.png";

const Icon = ({ d, className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  home: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10",
  jobs: "M3 7h18M3 7v12a1 1 0 001 1h16a1 1 0 001-1V7M3 7l1.5-3h15L21 7M9 12h6",
  postJob: "M12 4v16m8-8H4",
  messages: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
  close: "M6 18L18 6M6 6l12 12",
  bars: "M4 6h16M4 12h16M4 18h16",
  profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  language: "M3 5h12M9 3v2m3.6 3C11.6 12 8 15 4 16m8-9c1.5 2.5 4 6 8 8M12 20l4-9 4 9m-7-2h6",
  help: "M9.09 9a3 3 0 115.83 1c0 2-3 2-3 4M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z",
  logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 5v1a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h5a2 2 0 012 2v1",
  bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
};

const STUDENT_LINKS = [
  { to: "/", label: "Home", icon: ICONS.home },
  { to: "/jobs", label: "Jobs", icon: ICONS.jobs },
  { to: "/my-jobs", label: "My Jobs", icon: ICONS.jobs },
  { to: "/messages", label: "Messages", icon: ICONS.messages },
];

const RECRUITER_LINKS = [
  { to: "/", label: "Home", icon: ICONS.home },
  { to: "/admin/jobs/post", label: "Post Job", icon: ICONS.postJob },
  { to: "/admin/jobs", label: "My Posted Jobs", icon: ICONS.jobs },
  { to: "/messages", label: "Messages", icon: ICONS.messages },
];

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: ICONS.home },
  { to: "/admin/pending-jobs", label: "Pending Jobs", icon: ICONS.jobs },
];

const menuLinksFor = (isEmployer) => [
  { to: "/profile", label: isEmployer ? "Company Profile" : "Profile", icon: ICONS.profile },
  { to: "/settings", label: "Settings", icon: ICONS.settings },
  { to: "/language", label: "Language", icon: ICONS.language },
  { to: "/help", label: "Help", icon: ICONS.help },
];

const ADMIN_MENU_LINKS = [];

const LinkList = ({ links, size = "text-base", onClick }) =>
  links.map((l) => (
    <Link key={l.to} to={l.to} onClick={onClick} className={`flex items-center gap-1.5 ${size}`}>
      <Icon d={l.icon} /> {l.label}
    </Link>
  ));

// Avatar showing profile initial
const Avatar = ({ user, size = "h-9 w-9", text = "text-sm" }) => {
  const initial = (user?.fullname || user?.email || "?").trim().charAt(0).toUpperCase();
  return (
    <div className={`${size} ${text} rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-semibold shrink-0`}>
      {initial}
    </div>
  );
};

// Bell icon for notification
const NotificationBell = ({ unreadCount, size = "h-6 w-6" }) => (
  <Link to="/notifications" aria-label="Notifications" className="relative inline-flex items-center">
    <Icon d={ICONS.bell} className={size} />
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
      await axiosInstance.get("/user/logout");
      dispatch(logoutUser());
      navigate("/login");
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
                  <Icon d={ICONS.logout} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="lg:hidden h-10 w-10 ml-auto flex items-center gap-3">
        {user && <NotificationBell unreadCount={unreadCount} size="h-5 w-5" />}
        {user && <Avatar user={user} size="h-8 w-8" text="text-xs" />}
        <Icon d={menuOpen ? ICONS.close : ICONS.bars} className="h-6 w-6" />
      </button>

      {menuOpen && (
        <div className="absolute top-20 left-0 w-full flex flex-col gap-4 px-6 py-6 shadow-md lg:hidden bg-[#F4F4F5] dark:bg-[#1a1a1d] border-b border-gray-200 dark:border-gray-700 z-50">
          {user ? (
            <>
              <LinkList links={navLinks} onClick={() => setMenuOpen(false)} />
              <button onClick={() => setDarkMode(!darkMode)} className="text-base px-3 py-1 rounded border border-gray-600 w-fit">
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              {menuLinks.length > 0 && (
                <LinkList links={menuLinks} onClick={() => setMenuOpen(false)} />
              )}
              <button onClick={() => setConfirmLogout(true)} className="flex items-center gap-2 text-sm text-red-500 text-left">
                <Icon d={ICONS.logout} /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setDarkMode(!darkMode)} className="text-base px-3 py-1 rounded border border-gray-600 w-fit">
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              <Link to="/login">Login</Link>
              <Link to="/register" className="bg-[#8B5CF6] text-white px-4 py-1.5 rounded">Register</Link>
            </>
          )}
        </div>
      )}

      {confirmLogout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#242426] rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border border-gray-200 dark:border-gray-700 animate-[fadeIn_0.15s_ease-out]">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
              <Icon d={ICONS.logout} className="h-6 w-6 text-red-500" />
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