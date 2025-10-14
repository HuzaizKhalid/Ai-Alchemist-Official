"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import {
  Menu,
  X,
  LayoutDashboard,
  DollarSign,
  Home,
  User,
  TreePine,
  Leaf,
  ArrowRight,
  Contact,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Background from "./Background";

export function Header() {
  const { user, searchesUsed, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [showDashboardSubmenu, setShowDashboardSubmenu] = useState(false);
  const pathname = usePathname();

  // Fetch total users count
  useEffect(() => {
    fetch("/api/total-users")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalUsers !== undefined) setTotalUsers(data.totalUsers);
      })
      .catch(() => setTotalUsers(null));
  }, []);
  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const handleSignOut = () => {
    logout();
    setIsMenuOpen(false);
  };

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link href={href}>
      <div className="flex items-center space-x-4 p-4 rounded-xl text-lg text-slate-200 hover:bg-white/10 hover:text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:backdrop-blur-md border border-transparent hover:border-white/20">
        {children}
      </div>
    </Link>
  );

  return (
    <>
      {/* Tree Planting Announcement Bar */}
      {showAnnouncementBar && (
        <div className="fixed w-full top-0 z-[60] bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white shadow-lg">
          <div className="relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>

            <div className="relative max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-5 h-5 text-green-200 animate-pulse" />
                    <Leaf className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <span className="text-sm font-semibold">
                      🌱 For every new member A tree gets planted
                    </span>
                    <span className="text-xs sm:text-sm text-green-100 font-medium">
                      Join our mission to plant 1 million trees through
                      sustainable AI searches
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* <Link
                    href="/tree-program"
                    className="hidden sm:flex items-center space-x-1 text-xs font-medium text-green-100 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnnouncementBar(false)}
                    className="text-green-100 hover:text-white hover:bg-white/10 w-6 h-6 p-0 rounded-full transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Glassy Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 top-0 ${
          showAnnouncementBar ? "pt-12" : ""
        }`}
      >
        {/* Glassmorphism container */}
        <div className="backdrop-blur-2xl bg-black/10 border-b border-white/2 shadow-lg">
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>

          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <Link href="/" className="flex items-center space-x-4 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <Image
                    src="/earth.png"
                    alt="Earth Logo"
                    className="relative w-10 h-10 lg:w-12 lg:h-12 drop-shadow-lg"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                      Alchemist Ai
                    </h1>
                    {/* Added small badge that says "beeta" - minimal change */}
                    <Badge
                      className="ml-3 text-xs uppercase px-2 py-0.5 font-medium"
                      variant={"destructive"}
                    >
                      beta
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-200 hidden sm:block font-medium opacity-80">
                    Sustainable AI Search
                  </p>
                </div>
              </Link>

              {/* Conditional: Hamburger Menu (Logged In) or Sign In Button (Logged Out) */}
              {user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(true)}
                  className="text-white hover:bg-white/20 hover:scale-110 rounded-full w-12 h-12 backdrop-blur-sm border border-white/10 hover:border-white/30 shadow-lg transition-all duration-300"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105 rounded-full px-6 py-2 shadow-xl hover:shadow-2xl transition-all duration-300 font-medium"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Total Users Badge & Live Support - Right aligned, sticky below navbar */}
        <div className="backdrop-blur-xl bg-black/5 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center gap-2 sm:gap-8">
              {/* 24/7 Live Support Box - Left side on mobile, left side on desktop */}
              <div className="flex order-1">
                <button
                  onClick={() => {
                    // Trigger the same chat functionality as SimpleChatWidget
                    const chatWidget = document.querySelector(
                      "[data-chat-widget]"
                    ) as HTMLElement;
                    if (chatWidget) {
                      chatWidget.click();
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                             text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105
                             text-sm font-medium border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2"
                >
                  💬 24/7 Live support
                </button>
              </div>

              {totalUsers !== null && (
                <span className="text-sm sm:text-base text-cyan-300 font-semibold bg-slate-800/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 order-2">
                  👥 Total Users: {totalUsers}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Glassy Slide-out Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-all duration-500 ease-out ${
          isMenuOpen && user
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Glassmorphism sidebar */}
        <div className="h-full backdrop-blur-3xl bg-white/10 border-l border-white/20 shadow-2xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-slate-900/20"></div>

          <div className="relative flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-black/5">
              <h2 className="text-xl font-semibold text-white drop-shadow-sm">
                Menu
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-white/20 hover:scale-110 rounded-full w-10 h-10 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-3">
              <NavLink href="/">
                <Home className="w-5 h-5 text-emerald-400 drop-shadow-sm" />
                <span className="drop-shadow-sm">Home</span>
              </NavLink>
              <NavLink href="/profile">
                <User className="w-5 h-5 text-emerald-400 drop-shadow-sm" />
                <span className="drop-shadow-sm">Profile</span>
              </NavLink>

              {/* Dashboard with Submenu */}
              <div>
                <button
                  onClick={() => setShowDashboardSubmenu(!showDashboardSubmenu)}
                  className="w-full flex items-center justify-between space-x-4 p-4 rounded-xl text-lg text-slate-200 hover:bg-white/10 hover:text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:backdrop-blur-md border border-transparent hover:border-white/20"
                >
                  <div className="flex items-center space-x-4">
                    <LayoutDashboard className="w-5 h-5 text-emerald-400 drop-shadow-sm" />
                    <span className="drop-shadow-sm">Dashboard</span>
                  </div>
                  {showDashboardSubmenu ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Dashboard Submenu */}
                {showDashboardSubmenu && (
                  <div className="ml-6 mt-2 space-y-2">
                    <NavLink href="/dashboard">
                      <LayoutDashboard className="w-4 h-4 text-emerald-400 drop-shadow-sm" />
                      <span className="drop-shadow-sm text-base">Overview</span>
                    </NavLink>
                    <NavLink href="/dashboard/calendar">
                      <Calendar className="w-4 h-4 text-emerald-400 drop-shadow-sm" />
                      <span className="drop-shadow-sm text-base">Calendar</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink href="/vote">
                <DollarSign className="w-5 h-5 text-emerald-400 drop-shadow-sm" />
                <span className="drop-shadow-sm">Vote</span>
              </NavLink>
              {/* Added Tree Program Link to Menu */}
              <NavLink href="/contact-us">
                <Contact className="w-5 h-5 text-emerald-400 drop-shadow-sm" />
                <span className="drop-shadow-sm">Contact Us</span>
              </NavLink>
              <NavLink href="/pricing">
                <DollarSign className="w-5 h-5 text-emerald-400 drop-shadow-sm" />
                <span className="drop-shadow-sm">Upgrade to Pro</span>
              </NavLink>
            </nav>

            {/* User Info and Sign Out Action */}
            <div className="p-6 border-t border-white/20 bg-black/5">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md w-full justify-center border-white/30 text-white px-4 py-3 rounded-lg text-sm shadow-lg font-medium"
                >
                  {searchesUsed ?? 0} / 3 Searches Used Today
                </Badge>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20 hover:scale-105 rounded-lg py-6 text-base text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Backdrop for the menu */}
      {isMenuOpen && user && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
