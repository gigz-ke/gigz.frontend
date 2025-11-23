import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getNames } from "country-list";
import axios from "axios";

interface UpdateUserDTO {
  username?: string;
  email?: string;
  country?: string;
  img?: string;
  phone?: string;
  desc?: string;
  password?: string;
}

const countries = getNames();

export const ProfileSettings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "security">("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    username: "",
    country: "",
    phone: "",
    desc: "",
    img: "",
  });

  const [accountForm, setAccountForm] = useState({
    email: "",
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || "",
        country: user.country || "",
        phone: user.phone || "",
        desc: user.desc || "",
        img: user.img || "",
      });
      setAccountForm({ email: user.email || "" });
      setImagePreview(user.img || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileForm((prev) => ({ ...prev, img: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updateData: UpdateUserDTO = {
        username: profileForm.username,
        country: profileForm.country,
        phone: profileForm.phone,
        desc: profileForm.desc,
        img: profileForm.img !== user?.img ? profileForm.img : undefined,
      };

      await axios.put(`/api/users/${user?._id}`, updateData);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axios.put(`/api/users/${user?._id}`, { email: accountForm.email });
      setMessage({ type: "success", text: "Email updated successfully!" });
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setMessage({ type: "error", text: "Failed to update email. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match!" });
      setLoading(false);
      return;
    }

    if (securityForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long!" });
      setLoading(false);
      return;
    }

    try {
      await axios.put(`/api/users/${user?._id}/password`, {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setMessage({ type: "error", text: "Failed to update password. Check your current password." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/users/${user?._id}`);
        await logout();
        window.location.href = "/";
      } catch {
        setMessage({ type: "error", text: "Failed to delete account. Please try again." });
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to view settings</h2>
          <a href="/login" className="text-[#1dbf73] hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <img
            src={user.img || "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#1dbf73]"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 bg-[#1dbf73] bg-opacity-10 text-[#1dbf73] rounded-full text-sm font-semibold">
                {user.isSeller ? "Seller Account" : "Buyer Account"}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {user.country || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            {["profile", "account", "security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "profile" | "account" | "security")}
                className={`flex-1 px-4 sm:px-6 py-3 text-center font-semibold transition text-sm sm:text-base ${
                  activeTab === tab
                    ? "text-[#1dbf73] border-b-2 border-[#1dbf73] bg-[#1dbf73] bg-opacity-5"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab === "profile" ? "Profile" : tab === "account" ? "Account" : "Security"}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div className={`mx-4 mt-4 sm:mx-8 p-3 rounded-lg font-medium text-sm sm:text-base ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Username</label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none transition"
                    />

                    <label className="block text-sm font-semibold text-gray-700">Country</label>
                    <select
                      value={profileForm.country}
                      onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                      className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none cursor-pointer transition"
                    >
                      <option value="">Select your country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1dbf73] file:bg-opacity-10 file:text-[#1dbf73] hover:file:bg-opacity-20 cursor-pointer transition"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md mt-2"
                      />
                    )}

                    <label className="block text-sm font-semibold text-gray-700">About You</label>
                    <textarea
                      value={profileForm.desc}
                      onChange={(e) => setProfileForm({ ...profileForm, desc: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={5}
                      className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none resize-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-6 py-3 bg-[#1dbf73] text-white rounded-lg font-semibold shadow hover:bg-[#19a463] transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Updating..." : "Save Profile Changes"}
                </button>
              </form>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <form onSubmit={handleAccountUpdate} className="space-y-6 max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ email: e.target.value })}
                  className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[#1dbf73] text-white rounded-lg font-semibold shadow hover:bg-[#19a463] transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Updating..." : "Update Email"}
                </button>

                {/* Danger Zone */}
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-red-600 mb-3">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-gray-600 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Delete My Account
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none transition"
                />

                <label className="block text-sm font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none transition"
                />

                <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none transition"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[#1dbf73] text-white rounded-lg font-semibold shadow hover:bg-[#19a463] transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>

                {/* Security Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                  <ul className="space-y-1">
                    <li>✓ Use at least 8 characters</li>
                    <li>✓ Include uppercase and lowercase letters</li>
                    <li>✓ Add numbers and special characters</li>
                    <li>✓ Avoid common words and personal information</li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
