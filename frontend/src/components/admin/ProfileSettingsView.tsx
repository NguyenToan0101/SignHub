/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  User, Lock, ShieldCheck, Mail, Phone, FileText, CheckCircle, Sparkles, Key 
} from "lucide-react";
import { ADMIN_PROFILE_DEFAULT } from "./mockAdminData";

interface ProfileSettingsViewProps {
  onShowToast: (message: string, type: "success" | "neutral") => void;
}

export function ProfileSettingsView({ onShowToast }: ProfileSettingsViewProps) {
  // Local profile state
  const [profile, setProfile] = React.useState({
    name: ADMIN_PROFILE_DEFAULT.name,
    email: ADMIN_PROFILE_DEFAULT.email,
    phone: ADMIN_PROFILE_DEFAULT.phone,
    bio: "Principal Curator of L'Art Décor, overseeing our active Saigon joinery workshops and elite metropolitan furniture curation."
  });

  // Password state
  const [passwords, setPasswords] = React.useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  // Security toggles
  const [twoFactor, setTwoFactor] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast("Profile details updated successfully", "success");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      onShowToast("Please enter all password fields", "neutral");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      onShowToast("Passwords do not match", "neutral");
      return;
    }
    onShowToast("Curator password changed successfully", "success");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const handleToggleTwoFactor = () => {
    const nextState = !twoFactor;
    setTwoFactor(nextState);
    onShowToast(
      nextState 
        ? "Two-Factor verification has been enabled" 
        : "Two-Factor verification has been disabled", 
      "success"
    );
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans" id="profile-settings-tab-view">
      
      {/* Title */}
      <div className="border-b border-[#c4c7c7]/30 pb-6">
        <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">
          CURATOR IDENTITY
        </span>
        <h1 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
          Portal Identity & Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left COLUMN - Profile configuration */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PROFILE FORM */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm">
            <h3 className="font-display text-xl card-title text-[#1b1c1c] font-bold mb-6 flex items-center gap-2">
              <User size={18} className="text-[#775a19]" />
              Update Curator Profile Details
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    Curator Name
                  </label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#775a19]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    Email address
                  </label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#775a19]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    Contact Phone
                  </label>
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#775a19]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    Showroom role
                  </label>
                  <input 
                    type="text" 
                    value={ADMIN_PROFILE_DEFAULT.role}
                    disabled
                    className="w-full bg-[#efeded]/40 border border-[#c4c7c7]/45 rounded-xl px-4 py-2.5 text-xs text-[#444748] font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Artistic Biography
                </label>
                <textarea 
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                  className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#775a19] resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1b1c1c] text-white hover:bg-[#775a19] rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md"
                >
                  SAVE PROFILE CHANGES
                </button>
              </div>

            </form>
          </div>

          {/* CHANGE CURATOR PASSWORD */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm">
            <h3 className="font-display text-xl card-title text-[#1b1c1c] font-bold mb-6 flex items-center gap-2">
              <Key size={18} className="text-[#775a19]" />
              Modify Access Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Current password *
                </label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#775a19]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    New password *
                  </label>
                  <input 
                    type="password" 
                    value={passwords.newPass}
                    onChange={(e) => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                    placeholder="Min 8 characters"
                    className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#775a19]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    Confirm new password *
                  </label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="Retype password"
                    className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#775a19]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1b1c1c] hover:bg-[#775a19] text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md"
                >
                  SAVE SECURITY PASSWORD
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Right COLUMN - Security toggles & Audits */}
        <div className="space-y-6">
          
          {/* Security details checklist */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm space-y-6">
            <h3 className="font-display text-lg text-[#1b1c1c] font-bold border-b border-[#c4c7c7]/10 pb-3">
              Portal Security Code
            </h3>

            {/* Switch 2FA */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#1b1c1c]">Two-Factor Authorization</h4>
                <p className="text-[10px] text-[#444748] mt-0.5 max-w-[180px]">Adds an extra phone confirmation verification check.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleTwoFactor}
                className={`w-11 h-6 rounded-full transition-all relative ${twoFactor ? "bg-[#775a19]" : "bg-[#c4c7c7]"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${twoFactor ? "right-1" : "left-1"}`} />
              </button>
            </div>

            {/* Switch alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#1b1c1c]">Inventory Stock Alerts</h4>
                <p className="text-[10px] text-[#444748] mt-0.5 max-w-[180px]">Notify curator as soon as stock drops below 5 units.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const state = !emailAlerts;
                  setEmailAlerts(state);
                  onShowToast(state ? "Stock notifications enabled" : "Stock notifications disabled", "neutral");
                }}
                className={`w-11 h-6 rounded-full transition-all relative ${emailAlerts ? "bg-[#775a19]" : "bg-[#c4c7c7]"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${emailAlerts ? "right-1" : "left-1"}`} />
              </button>
            </div>
          </div>

          {/* Role based access layout */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm space-y-4">
            <h3 className="font-display text-lg text-[#1b1c1c] font-bold border-b border-[#c4c7c7]/10 pb-3">
              Role-Based Matrix Plan
            </h3>
            
            <p className="text-xs text-[#444748] leading-relaxed">
              Portal access credentials can be extended with granular sub-rules for incoming moderators:
            </p>

            <div className="space-y-2 text-[10px] font-semibold text-[#444748]">
              <div className="flex justify-between p-2.5 bg-[#fbf9f9] rounded-lg border border-[#c4c7c7]/10">
                <span>Director / Principal Curator</span>
                <span className="text-[#775a19] font-bold uppercase font-mono">OWNER ROOT</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#fbf9f9] rounded-lg border border-[#c4c7c7]/10">
                <span>Atelier Editor</span>
                <span className="text-[#444748]/50 uppercase font-mono">No stats reports</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#fbf9f9] rounded-lg border border-[#c4c7c7]/10">
                <span>Showroom Moderator</span>
                <span className="text-[#444748]/50 uppercase font-mono">CRUD forms read only</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
