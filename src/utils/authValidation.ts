
export const validateEmail = (email: string): string => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required";
  }
  if (!re.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return "";
};

export const validateName = (name: string): string => {
  if (!name) {
    return "Name is required";
  }
  return "";
};
