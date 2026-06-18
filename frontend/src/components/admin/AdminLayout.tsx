/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Menu, X, Search, Bell, ChevronDown, LayoutDashboard, 
  BarChart3, Inbox, ShoppingCart, Users, User, Settings, LogOut, Sparkles 
} from "lucide-react";
import { ADMIN_PROFILE_DEFAULT } from "./mockAdminData";

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminLayout({ activeTab, setActiveTab, onLogout, children }: AdminLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  // Quick sidebar links
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "products", label: "Products", icon: Inbox },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "profile", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex text-[#1b1c1c] font-sans selection:bg-[#775a19]/20 selection:text-[#1b1c1c]" id="admin-master-container">
      
      {/* 1. SOLID DESKTOP SIDEBAR - Glassmorphic / Premium Silt Look */}
      <aside 
        id="admin-desktop-sidebar"
        className="hidden lg:flex flex-col justify-between w-64 bg-white border-r border-[#c4c7c7]/30 h-screen sticky top-0 px-6 py-8"
      >
        <div className="space-y-10">
          {/* Logo brand signature */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#775a19]/10 flex items-center justify-center border border-[#775a19]/25">
              <Sparkles className="text-[#775a19] w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-lg tracking-[0.2em] font-semibold text-[#1b1c1c]">
                L'ART DÉCOR
              </h2>
              <span className="text-[8px] font-bold tracking-[0.25em] text-[#775a19] uppercase block -mt-1">
                ATELIER ADMIN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" id="desktop-sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 group ${
                    isActive 
                      ? "bg-[#775a19] text-white shadow-md shadow-[#775a19]/15" 
                      : "text-[#444748] hover:text-[#1b1c1c] hover:bg-[#efeded]/40"
                  }`}
                >
                  <Icon size={16} className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-115"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Curator Profile & Logout */}
        <div className="border-t border-[#c4c7c7]/20 pt-6 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c4c7c7]/40 bg-[#efeded]">
              <img src={ADMIN_PROFILE_DEFAULT.avatar} alt="Admin avatar" className="w-full h-full object-cover" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-[#1b1c1c] truncate">
                {ADMIN_PROFILE_DEFAULT.name}
              </h4>
              <span className="text-[9px] font-medium tracking-wide text-[#444748] block truncate">
                {ADMIN_PROFILE_DEFAULT.role}
              </span>
            </div>
          </div>

          <button
            id="desktop-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3 border border-[#c4c7c7]/40 rounded-xl text-xs font-bold tracking-wider uppercase text-[#444748] hover:text-red-700 hover:border-red-200 hover:bg-red-50/50 transition-all duration-300"
          >
            <LogOut size={14} />
            LOGOUT PORTAL
          </button>
        </div>
      </aside>

      {/* 2. MOBILE CURTAIN SIDEBAR DRAWERS */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" id="admin-mobile-drawer">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-[#1b1c1c]/50 backdrop-blur-sm transition-opacity"
            id="mobile-drawer-backdrop"
          />

          <div 
            className="relative flex flex-col justify-between w-64 max-w-xs bg-white h-full px-6 py-8 animation-slide-in-right"
            id="mobile-drawer-body"
          >
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-display tracking-widest font-bold text-[#775a19]">
                    L'ART COMPASS
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 hover:bg-[#efeded]/50 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5" id="mobile-sidebar-nav">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                        isActive 
                          ? "bg-[#775a19] text-white shadow-md shadow-[#775a19]/10" 
                          : "text-[#444748] hover:text-[#1b1c1c] hover:bg-[#efeded]/30"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-[#c4c7c7]/20 pt-6 space-y-4">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 rounded-xl text-xs font-bold tracking-wider uppercase text-red-700 bg-red-50 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut size={14} />
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRIMARY CONTENT AREA */}
      <div className="flex-grow flex flex-col min-h-screen min-w-0" id="admin-viewport">
        {/* Dynamic Header / Topbar */}
        <header 
          id="admin-topbar"
          className="bg-white border-b border-[#c4c7c7]/30 h-20 sticky top-0 z-30 px-6 md:px-10 flex justify-between items-center"
        >
          {/* Mobile view list toggle */}
          <div className="flex items-center gap-4">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-[#1b1c1c] hover:bg-[#efeded]/50 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 px-3.5 py-1.5 rounded-full w-64 md:w-80">
              <Search size={14} className="text-[#444748]/50" />
              <input 
                placeholder="Search across L'Art archives..." 
                className="bg-transparent border-none text-xs font-sans focus:outline-none focus:ring-0 placeholder-[#444748]/40 w-full"
              />
            </div>
          </div>

          {/* Action widgets & notifications */}
          <div className="flex items-center gap-5">
            {/* Elegant Golden Notification bell */}
            <div className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileDropdownOpen(false);
                }}
                className="p-2.5 rounded-full hover:bg-[#efeded]/40 text-[#444748] hover:text-[#1b1c1c] relative transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#775a19] rounded-full animate-bounce" />
              </button>

              {isNotificationsOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 bg-white border border-[#c4c7c7]/30 shadow-2xl rounded-2xl p-5 z-40 animate-fade-in"
                  id="notifications-dropdown"
                >
                  <h3 className="font-sans text-[10px] tracking-widest font-bold uppercase text-[#775a19] mb-3">
                    CHRONICLE ALERTS
                  </h3>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    <div className="pb-3 border-b border-[#c4c7c7]/10">
                      <span className="text-[9px] font-bold text-[#775a19] block">STOCK WARNING</span>
                      <p className="text-xs text-[#1b1c1c] mt-0.5">Nén Lounge Chair inventory dropped to 3 units.</p>
                      <span className="text-[9px] text-[#444748]/60 font-medium block mt-1">10 minutes ago</span>
                    </div>
                    <div className="pb-3 border-b border-[#c4c7c7]/10">
                      <span className="text-[9px] font-bold text-green-700 block">NEW ORDER SELECTION</span>
                      <p className="text-xs text-[#1b1c1c] mt-0.5">ORD-2026-001 has been registered by Pham Minh Hoang.</p>
                      <span className="text-[9px] text-[#444748]/60 font-medium block mt-1">2 hours ago</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#444748] block">SYSTEM NOTE</span>
                      <p className="text-xs text-[#1b1c1c] mt-0.5">Backup system log exported successfully.</p>
                      <span className="text-[9px] text-[#444748]/60 font-medium block mt-1">1 day ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Curator Dropdown */}
            <div className="relative">
              <button
                id="admin-dropdown-toggle-btn"
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-full hover:bg-[#efeded]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c4c7c7]/30 bg-[#efeded]">
                  <img src={ADMIN_PROFILE_DEFAULT.avatar} alt="Admin avatar" className="w-full h-full object-cover" />
                </div>
                <ChevronDown size={14} className="text-[#444748]" />
              </button>

              {isProfileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-3 w-56 bg-white border border-[#c4c7c7]/30 shadow-2xl rounded-2xl p-4 z-40 animate-fade-in"
                  id="admin-profile-dropdown"
                >
                  <div className="pb-3 border-b border-[#c4c7c7]/10 mb-2 px-1">
                    <span className="text-[8px] font-bold text-[#775a19] tracking-widest uppercase">
                      PORTAL CURATOR
                    </span>
                    <h5 className="text-xs font-bold text-[#1b1c1c] mt-0.5 truncate">
                      {ADMIN_PROFILE_DEFAULT.name}
                    </h5>
                    <p className="text-[10px] text-[#444748] truncate">
                      {ADMIN_PROFILE_DEFAULT.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="text-left font-sans text-[11px] font-semibold tracking-wider text-[#444748] hover:text-[#1b1c1c] p-2 hover:bg-[#efeded]/30 rounded-lg"
                    >
                      EDIT PROFILE
                    </button>
                    <button
                      onClick={onLogout}
                      className="text-left font-sans text-[11px] font-semibold tracking-wider text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg"
                    >
                      EXIT ADMIN PORTAL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 4. MAIN DYNAMIC CHILDREN VIEW */}
        <main className="flex-grow p-6 md:p-10 max-w-[1600px] w-full mx-auto" id="admin-main-view-wrapper">
          {children}
        </main>
      </div>

    </div>
  );
}
