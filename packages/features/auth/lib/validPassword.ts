export function validPassword(password: string) {
  // Minimum 12 characters for stronger security
  if (password.length < 12) return false;

  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;

  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;

  // Must contain at least one digit
  if (!/\d/.test(password)) return false;

  // Must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) return false;

  return true;
}
