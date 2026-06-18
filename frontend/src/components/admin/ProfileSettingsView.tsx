/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Key, User } from "lucide-react";
import { api } from "../../api";
import { ADMIN_PROFILE_DEFAULT } from "./mockAdminData";

interface ProfileSettingsViewProps {
  onShowToast: (message: string, type: "success" | "neutral") => void;
  lowStockThreshold: number;
  onLowStockThresholdChange: (value: number) => void;
}

export function ProfileSettingsView({ onShowToast, lowStockThreshold, onLowStockThresholdChange }: ProfileSettingsViewProps) {
  const savedProfile = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("signhub_admin_profile_settings") || "null");
    } catch {
      return null;
    }
  }, []);
  const [profile, setProfile] = React.useState({
    name: ADMIN_PROFILE_DEFAULT.name,
    email: ADMIN_PROFILE_DEFAULT.email,
    phone: ADMIN_PROFILE_DEFAULT.phone,
    ...(savedProfile || {}),
    bio: "Quản trị viên chính của SignHub, phụ trách sản phẩm, đơn hàng và vận hành xưởng.",
  });
  const [passwords, setPasswords] = React.useState({ current: "", newPass: "", confirm: "" });
  const [twoFactor, setTwoFactor] = React.useState(true);
  const [stockAlerts, setStockAlerts] = React.useState(() => localStorage.getItem("signhub_stock_alerts_enabled") !== "false");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = await api.updateAdminProfile({ fullName: profile.name, email: profile.email, phone: profile.phone });
      localStorage.setItem("signhub_admin_token", auth.token);
      localStorage.setItem("signhub_admin_profile", JSON.stringify(auth));
      localStorage.setItem("signhub_admin_profile_settings", JSON.stringify(profile));
      onShowToast("Đã cập nhật thông tin hồ sơ", "success");
    } catch (error) {
      onShowToast(error instanceof Error ? `Chưa cập nhật được hồ sơ: ${error.message}` : "Chưa cập nhật được hồ sơ", "neutral");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      onShowToast("Vui lòng nhập đầy đủ thông tin mật khẩu", "neutral");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      onShowToast("Mật khẩu xác nhận không khớp", "neutral");
      return;
    }
    if (passwords.newPass.length < 6) {
      onShowToast("Mật khẩu mới cần tối thiểu 6 ký tự", "neutral");
      return;
    }
    try {
      await api.changeAdminPassword({ currentPassword: passwords.current, newPassword: passwords.newPass });
      onShowToast("Đã đổi mật khẩu thành công", "success");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (error) {
      onShowToast(error instanceof Error ? `Chưa đổi được mật khẩu: ${error.message}` : "Chưa đổi được mật khẩu", "neutral");
    }
  };

  const handleThresholdChange = (value: number) => {
    const safeValue = Math.max(1, Math.min(999, value || 1));
    localStorage.setItem("signhub_low_stock_threshold", String(safeValue));
    onLowStockThresholdChange(safeValue);
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans" id="profile-settings-tab-view">
      <div className="border-b border-[#c4c7c7]/30 pb-6">
        <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">Hồ sơ quản trị</span>
        <h1 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">Hồ sơ và cài đặt</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Panel title="Cập nhật thông tin quản trị viên" icon={<User size={18} className="text-[#775a19]" />}>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Họ tên">
                  <input type="text" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="admin-input text-xs" required />
                </Field>
                <Field label="Địa chỉ email">
                  <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className="admin-input text-xs" required />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Số điện thoại">
                  <input type="text" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="admin-input text-xs" required />
                </Field>
                <Field label="Vai trò">
                  <input type="text" value={ADMIN_PROFILE_DEFAULT.role} disabled className="admin-input text-xs bg-[#efeded]/40 text-[#444748] cursor-not-allowed" />
                </Field>
              </div>
              <Field label="Giới thiệu">
                <textarea rows={3} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} className="admin-input text-xs resize-none" />
              </Field>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-3 bg-[#1b1c1c] text-white hover:bg-[#775a19] rounded-full text-xs font-bold tracking-widest uppercase">
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </Panel>

          <Panel title="Đổi mật khẩu truy cập" icon={<Key size={18} className="text-[#775a19]" />}>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Field label="Mật khẩu hiện tại *">
                <input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} placeholder="********" className="admin-input text-xs" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Mật khẩu mới *">
                  <input type="password" value={passwords.newPass} onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))} placeholder="Tối thiểu 8 ký tự" className="admin-input text-xs" />
                </Field>
                <Field label="Xác nhận mật khẩu mới *">
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} placeholder="Nhập lại mật khẩu" className="admin-input text-xs" />
                </Field>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-3 bg-[#1b1c1c] hover:bg-[#775a19] text-white rounded-full text-xs font-bold tracking-widest uppercase">
                  Lưu mật khẩu
                </button>
              </div>
            </form>
          </Panel>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm space-y-6">
            <h3 className="font-display text-lg text-[#1b1c1c] font-bold border-b border-[#c4c7c7]/10 pb-3">Bảo mật tài khoản</h3>
            <Toggle title="Xác thực hai lớp" description="Thêm bước xác nhận khi đăng nhập." enabled={twoFactor} onToggle={() => {
              const next = !twoFactor;
              setTwoFactor(next);
              onShowToast(next ? "Đã bật xác thực hai lớp" : "Đã tắt xác thực hai lớp", "success");
            }} />
            <Toggle title="Cảnh báo tồn kho" description="Thông báo khi tồn kho dưới 5 cái." enabled={stockAlerts} onToggle={() => {
              const next = !stockAlerts;
              setStockAlerts(next);
              localStorage.setItem("signhub_stock_alerts_enabled", String(next));
              onShowToast(next ? "Đã bật thông báo tồn kho" : "Đã tắt thông báo tồn kho", "neutral");
            }} />
            <Field label="Ngưỡng cảnh báo tồn kho">
              <input
                type="number"
                min={1}
                max={999}
                value={lowStockThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="admin-input text-xs"
              />
            </Field>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm space-y-4">
            <h3 className="font-display text-lg text-[#1b1c1c] font-bold border-b border-[#c4c7c7]/10 pb-3">Phân quyền truy cập</h3>
            <p className="text-xs text-[#444748] leading-relaxed">Có thể mở rộng quyền theo từng vai trò trong trang quản trị.</p>
            <Role name="Chủ sở hữu / quản trị chính" permission="Toàn quyền" highlight />
            <Role name="Biên tập viên" permission="Không xem báo cáo" />
            <Role name="Điều phối viên" permission="Chỉ xem dữ liệu" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm">
      <h3 className="font-display text-xl text-[#1b1c1c] font-bold mb-6 flex items-center gap-2">{icon}{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ title, description, enabled, onToggle }: { title: string; description: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-xs font-bold text-[#1b1c1c]">{title}</h4>
        <p className="text-[10px] text-[#444748] mt-0.5 max-w-[180px]">{description}</p>
      </div>
      <button type="button" onClick={onToggle} className={`w-11 h-6 rounded-full transition-all relative ${enabled ? "bg-[#775a19]" : "bg-[#c4c7c7]"}`}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${enabled ? "right-1" : "left-1"}`} />
      </button>
    </div>
  );
}

function Role({ name, permission, highlight = false }: { name: string; permission: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between p-2.5 bg-[#fbf9f9] rounded-lg border border-[#c4c7c7]/10 text-[10px] font-semibold text-[#444748]">
      <span>{name}</span>
      <span className={`${highlight ? "text-[#775a19]" : "text-[#444748]/50"} uppercase font-mono font-bold`}>{permission}</span>
    </div>
  );
}
