import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { logoutUser } from "../redux/authSlice";
import { useTheme } from "../utils/ThemeContext";
import logo from "../assets/logo.png";

const Icon = ({ d, className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const ICONS = {
    home: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10",
    jobs: "M3 7h18M3 7v12a1 1 0 001 1h16a1 1 0 001-1V7M3 7l1.5-3h15L21 7M9 12h6",
    messages: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
    bars: "M4 6h16M4 12h16M4 18h16",
    close: "M6 18L18 6M6 6l12 12",
    profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    language: "M3 5h12M9 3v2m3.6 3C11.6 12 8 15 4 16m8-9c1.5 2.5 4 6 8 8M12 20l4-9 4 9m-7-2h6",
    help: "M9.09 9a3 3 0 115.83 1c0 2-3 2-3 4M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 5v1a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h5a2 2 0 012 2v1",
};

const NAV_LINKS = [
    { to: "/", label: "Home", icon: ICONS.home },
    { to: "/jobs", label: "Jobs", icon: ICONS.jobs },
    { to: "/messages", label: "Messages", icon: ICONS.messages },
];

const MENU_LINKS = [
    { to: "/profile", label: "Profile", icon: ICONS.profile },
    { to: "/settings", label: "Settings", icon: ICONS.settings },
    { to: "/language", label: "Language", icon: ICONS.language },
    { to: "/help", label: "Help", icon: ICONS.help },
];

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { darkMode, setDarkMode } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);

    const logoutHandler = async () => {
        try {
            await axiosInstance.get("/user/logout");
            dispatch(logoutUser());
            navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setConfirmLogout(false);
            setDropdownOpen(false);
            setMenuOpen(false);
        }
    };

    const LinkList = ({ links, size = "text-base", onClick }) => (
        <>
            {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={onClick} className={`flex items-center gap-1.5 ${size}`}>
                    <Icon d={l.icon} className="h-4 w-4" /> {l.label}
                </Link>
            ))}
        </>
    );

    const ThemeToggle = ({ className = "" }) => (
        <button onClick={() => setDarkMode(!darkMode)} className={`text-base px-3 py-1 rounded border border-gray-600 ${className}`}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
    );

    const AuthLinks = ({ size = "text-base" }) => (
        <>
            <Link to="/login" className={size}>Login</Link>
            <Link to="/register" className={`bg-[#8B5CF6] text-white px-4 py-1.5 rounded ${size}`}>Register</Link>
        </>
    );

    const LogoutBtn = ({ onClick }) => (
        <button onClick={onClick} className="flex items-center gap-2 text-sm px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-left">
            <Icon d={ICONS.logout} className="h-4 w-4" /> Logout
        </button>
    );

    return (
        <nav className="relative flex items-center px-4 sm:px-8 h-20 shadow-md bg-[#F4F4F5] dark:bg-[#1a1a1d] text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2 shrink-0">
                <img src={logo} alt="Job Portal Logo" className="h-14 sm:h-25 w-auto" />
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-10 ml-auto">
                {user && <LinkList links={NAV_LINKS} />}
                <ThemeToggle />
                {!user && <AuthLinks />}
            </div>

            {user && (
                <div className="relative ml-6 hidden lg:block">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="Menu" className="h-10 w-10 flex items-center justify-center">
                        <Icon d={ICONS.bars} className="h-6 w-6" />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 top-12 w-52 flex flex-col gap-1 py-3 rounded-lg shadow-lg bg-white dark:bg-[#242426] border border-gray-200 dark:border-gray-700 z-50">
                            <LinkList links={MENU_LINKS} size="text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setDropdownOpen(false)} />
                            <LogoutBtn onClick={() => setConfirmLogout(true)} />
                        </div>
                    )}
                </div>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="lg:hidden h-10 w-10 ml-auto">
                <Icon d={menuOpen ? ICONS.close : ICONS.bars} className="h-6 w-6" />
            </button>

            {menuOpen && (
                <div className="absolute top-20 left-0 w-full flex flex-col gap-4 px-6 py-6 shadow-md lg:hidden bg-[#F4F4F5] dark:bg-[#1a1a1d] border-b border-gray-200 dark:border-gray-700 z-50">
                    {user ? (
                        <>
                            <LinkList links={NAV_LINKS} onClick={() => setMenuOpen(false)} />
                            <ThemeToggle className="w-fit" />
                            <LinkList links={MENU_LINKS} onClick={() => setMenuOpen(false)} />
                            <LogoutBtn onClick={() => setConfirmLogout(true)} />
                        </>
                    ) : (
                        <>
                            <ThemeToggle className="w-fit" />
                            <AuthLinks />
                        </>
                    )}
                </div>
            )}

            {confirmLogout && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#242426] rounded-lg p-6 w-72 text-center shadow-xl">
                        <p className="text-sm mb-5">Are you sure you want to logout?</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setConfirmLogout(false)} className="px-4 py-1.5 rounded border border-gray-400 text-sm">Cancel</button>
                            <button onClick={logoutHandler} className="px-4 py-1.5 rounded bg-red-500 text-white text-sm">Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
