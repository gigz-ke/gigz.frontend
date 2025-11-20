import { useState } from "react";
import { getNames } from "country-list";
import { createUser } from "../../data/services/userService";
import type { CreateUserDTO } from "../../data/models/User";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const countries = getNames();

export const CreateUserForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateUserDTO>({
    username: "",
    email: "",
    password: "",
    country: "",
    img: "",
    phone: "",
    desc: "",
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked, files } = target;

    if (name === "img" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm((prev) => ({ ...prev, img: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password || !form.country) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await createUser(form);
      setMessage("Registration successful! Redirecting to login...");

      // Reset form
      setForm({
        username: "",
        email: "",
        password: "",
        country: "",
        img: "",
        phone: "",
        desc: "",
        isSeller: false,
      });
      setImagePreview(null);

      // Redirect after a short delay
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Join Our Community
          </h1>
          <p className="text-lg text-gray-600">
            Create your account and start your journey with us
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-10">
          {message && (
            <div
              className={`mb-6 p-4 text-center rounded-xl font-medium ${
                message.includes("successful")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Password + Toggle */}
              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Password *
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition pr-12"
                  />

                  {/* Eye Toggle */}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Country *
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="p-3 w-full border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  About You
                </label>
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself..."
                  className="p-3 w-full h-28 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold text-sm">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-44 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <input
                  type="checkbox"
                  name="isSeller"
                  id="isSeller"
                  checked={form.isSeller}
                  onChange={handleChange}
                  className="w-5 h-5 mt-0.5 text-purple-600 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="isSeller" className="text-gray-700 cursor-pointer">
                  <span className="font-semibold block mb-1">Join as a Seller</span>
                  <span className="text-sm text-gray-600">
                    Get access to seller tools and start listing your products
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="py-4 mt-auto bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? "Creating Your Account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
