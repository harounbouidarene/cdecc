"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { validateRegister } from "@/lib/validate";

const fields = [
  { name: "fullName", label: "Full name", type: "text", placeholder: "Your full name", icon: User },
  { name: "email", label: "Email address", type: "email", placeholder: "name@example.com", icon: Mail },
  { name: "password", label: "Password", type: "password", placeholder: "At least 6 characters", icon: Lock },
  { name: "confirmPassword", label: "Confirm password", type: "password", placeholder: "Repeat your password", icon: Lock },
  { name: "phone", label: "Phone number", type: "tel", placeholder: "0555 00 00 00", icon: Phone },
];

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  terms: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    const clientErrors = validateRegister(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || { form: data.message });
      } else {
        setSuccess(true);
        setForm(emptyForm);
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-sm"
      >
        <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
          Create account
        </h1>
        <p className="mt-1 mb-6 text-sm text-stone-500">
          Fill in the details below to get started.
        </p>

        <div className="space-y-4">
          {fields.map(({ name, label, type, placeholder, icon: Icon }) => {
            const isPassword = type === "password";
            const hasError = Boolean(errors[name]);

            return (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-stone-700 mb-1.5">
                  {label}
                </label>

                <div className="relative">
                  <Icon
                    size={18}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      hasError ? "text-red-500" : "text-stone-400"
                    }`}
                  />
                  <input
                    id={name}
                    name={name}
                    type={isPassword && showPassword ? "text" : type}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full h-11 pl-10 ${isPassword ? "pr-10" : "pr-3"} rounded-lg border text-sm outline-none transition placeholder:text-stone-400 ${
                      hasError
                        ? "border-red-300 bg-red-50/50 focus:border-red-500"
                        : "border-stone-300 bg-white focus:border-stone-900"
                    }`}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>

                {hasError && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {errors[name]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <label className="flex items-center gap-2.5 text-sm text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="size-4 accent-stone-900"
            />
            <span>
              I agree to the{" "}
              <span className="font-medium text-stone-900 underline underline-offset-2">
                Terms and Conditions
              </span>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle size={14} />
              {errors.terms}
            </p>
          )}
        </div>

        {errors.form && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle size={16} />
            {errors.form}
          </p>
        )}

        {success && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircle2 size={16} />
            Your account has been created.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-stone-900 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </main>
  );
}
