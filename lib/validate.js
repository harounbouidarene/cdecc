// نفس الدالة تستعملها الواجهة والسيرفر
export function validateRegister(data = {}) {
  const normalized = {
    fullName: typeof data.fullName === "string" ? data.fullName.trim() : "",
    email: typeof data.email === "string" ? data.email.trim().toLowerCase() : "",
    password: typeof data.password === "string" ? data.password : "",
    confirmPassword: typeof data.confirmPassword === "string" ? data.confirmPassword : "",
    phone: typeof data.phone === "string" ? data.phone.trim() : "",
    terms: Boolean(data.terms),
  };

  const errors = {};

  if (!normalized.fullName || normalized.fullName.length < 3)
    errors.fullName = "Full name must be at least 3 characters long.";

  if (!/^\S+@\S+\.\S+$/.test(normalized.email))
    errors.email = "Please enter a valid email address.";

  if (!normalized.password || normalized.password.length < 6)
    errors.password = "Password must be at least 6 characters long.";

  if (normalized.confirmPassword !== normalized.password)
    errors.confirmPassword = "Passwords do not match.";

  if (!/^\+?[0-9\s-]{8,15}$/.test(normalized.phone))
    errors.phone = "Please enter a valid phone number.";

  if (!normalized.terms) errors.terms = "You must agree to the terms.";

  return errors;
}
