
export const validateEmail = (email: string): string => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "auth.emailRequired";
  }
  if (!re.test(email)) {
    return "auth.invalidEmail";
  }
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return "auth.passwordRequired";
  }
  if (password.length < 6) {
    return "auth.passwordTooShort";
  }
  return "";
};

export const validateName = (name: string): string => {
  if (!name) {
    return "auth.nameRequired";
  }
  return "";
};

// New validation function for confirm password
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) {
    return "auth.confirmPasswordRequired";
  }
  if (password !== confirmPassword) {
    return "auth.passwordsDoNotMatch";
  }
  return "";
};
