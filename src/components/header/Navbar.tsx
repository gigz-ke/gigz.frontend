// src/components/navbar/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCategory } from "../../hooks/useCategory";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { pathname } = useLocation();
  const { user, logout, loading } = useAuth();
  const { categories, fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const isActive = () => setActive(window.scrollY > 0);

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => window.removeEventListener("scroll", isActive);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      setMobileMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (open && !target.closest(".user-dropdown")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-500 shadow-sm ${active || pathname !== "/"
          ? "bg-white text-black"
          : "bg-[#013914] text-white"
        }`}
    >
      {/* Navbar Container */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-5">

        {/* Logo */}
        <div className="text-2xl font-bold flex items-center gap-1">
          <Link to="/" className="flex items-center hover:opacity-80 transition">
            <span>Gigz</span>
          </Link>
          <span className="text-[#1dbf73]">.</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/gigs/hub" className="whitespace-nowrap hover:text-[#1dbf73] transition">
            Explore Services
          </Link>

          {!loading && user ? (
            <div
              className="user-dropdown relative flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
              onClick={() => setOpen(!open)}
            >
              <img
                src={
                  user.img || "/hero.png"
                }
                alt={user.username}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#1dbf73]"
              />
              <span className="font-semibold">{user.username}</span>

              {open && (
                <div className="absolute top-14 right-0 w-56 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
                  {/* User Header */}
                  <div className="bg-linear-to-r from-[#013914] to-[#1dbf73] text-white p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.img ||
                          "/hero.png"
                        }
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                      />
                      <div>
                        <p className="font-semibold text-sm">{user.username}</p>
                        <p className="text-xs opacity-90">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {user.isSeller === true && (
                      <>
                        <Link
                          to="/gigs"
                          className="block px-4 py-2.5 hover:bg-gray-50 rounded-lg transition"
                        >
                          My Gigs
                        </Link>
                        <Link
                          to="/gigs/add"
                          className="block px-4 py-2.5 hover:bg-gray-50 rounded-lg transition"
                        >
                          Add New Gig
                        </Link>
                        <hr className="my-2 border-gray-200" />
                      </>
                    )}
                    <Link to="/orders" className="block px-4 py-2.5 hover:bg-gray-50 rounded-lg transition">
                      Orders
                    </Link>
                    <Link to="/messages" className="block px-4 py-2.5 hover:bg-gray-50 rounded-lg transition">
                      Messages
                    </Link>
                    <Link to="/account" className="block px-4 py-2.5 hover:bg-gray-50 rounded-lg transition">
                      Profile Settings
                    </Link>

                    <hr className="my-2 border-gray-200" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !loading ? (
            <>
              <Link to="/login" className="hover:text-[#1dbf73] transition">
                Sign in
              </Link>

              <Link to="/join">
                <button
                  className={`px-5 py-2.5 rounded-lg border-2 font-semibold transition-all duration-300 ${active || pathname !== "/"
                      ? "border-[#1dbf73] text-[#1dbf73] bg-white hover:bg-[#1dbf73] hover:text-white"
                      : "border-white text-white hover:bg-[#1dbf73] hover:border-[#1dbf73]"
                    }`}
                >
                  Join Now
                </button>
              </Link>
            </>
          ) : (
            <div className="w-8 h-8 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-3xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* CATEGORIES MENU (desktop only) */}
      {(active || pathname !== "/") && (
        <>
          <hr className="border-t border-gray-200 hidden md:block" />
          <div className="max-w-[1400px] mx-auto px-4 py-3 hidden md:flex justify-between text-gray-600 font-medium flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}/gigs`}
                className="hover:text-[#1dbf73] transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <hr className="border-t border-gray-200 hidden md:block" />
        </>
      )}

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenu && (
        <div className="md:hidden w-full bg-white text-black shadow-lg px-4 py-4 flex flex-col gap-4">

          <Link to="/gigs/hub" onClick={() => setMobileMenu(false)}>
            Explore Services
          </Link>

          {/* Logged-in items */}
          {!loading && user ? (
            <>
              {user.isSeller && (
                <>
                  <Link to="/gigs" onClick={() => setMobileMenu(false)}>My Gigs</Link>
                  <Link to="/gigs/add" onClick={() => setMobileMenu(false)}>Add New Gig</Link>
                </>
              )}
              <Link to="/orders" onClick={() => setMobileMenu(false)}>Orders</Link>
              <Link to="/messages" onClick={() => setMobileMenu(false)}>Messages</Link>
              <Link to="/account" onClick={() => setMobileMenu(false)}>Profile Settings</Link>

              <button
                className="text-left text-red-600 mt-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenu(false)}>Sign in</Link>
              <Link to="/join" onClick={() => setMobileMenu(false)}>Join Now</Link>
            </>
          )}

          {/* ------------------------------- */}
          {/*      NEW ELEGANT CATEGORY UI     */}
          {/* ------------------------------- */}

          <hr className="my-3" />

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-2 text-lg font-semibold text-gray-800">
              Browse Categories
              <span className="transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>

            {/* Collapsible Content */}
            <div className="mt-3 pl-1 flex flex-col gap-3 animate-slideDown">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}/gigs`}
                  onClick={() => setMobileMenu(false)}
                  className="py-2 px-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </details>

        </div>
      )}

    </div>
  );
}

export default Navbar;
