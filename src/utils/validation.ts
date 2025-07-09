export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { field: 'email', message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  return null;
};

// Password validation
export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Password is required' };
  }
  if (password.length < 6) {
    return { field: 'password', message: 'Password must be at least 6 characters long' };
  }
  return null;
};

// Name validation
export const validateName = (name: string, fieldName: string): ValidationError | null => {
  if (!name) {
    return { field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` };
  }
  if (name.length < 2) {
    return { field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters long` };
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} can only contain letters and spaces` };
  }
  return null;
};

// Professional number validation
export const validateProfessionalNumber = (number: string): ValidationError | null => {
  if (!number) {
    return { field: 'professionalNumber', message: 'Professional registration number is required' };
  }
  if (number.length < 5) {
    return { field: 'professionalNumber', message: 'Professional registration number must be at least 5 characters long' };
  }
  return null;
};

// Institution validation
export const validateInstitution = (institution: string): ValidationError | null => {
  if (!institution) {
    return { field: 'institution', message: 'Institution is required' };
  }
  if (institution.length < 3) {
    return { field: 'institution', message: 'Institution name must be at least 3 characters long' };
  }
  return null;
};

// Auth form validation
export const validateAuthForm = (form: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(form.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(form.password);
  if (passwordError) errors.push(passwordError);

  if (form.firstName) {
    const firstNameError = validateName(form.firstName, 'firstName');
    if (firstNameError) errors.push(firstNameError);
  }

  if (form.lastName) {
    const lastNameError = validateName(form.lastName, 'lastName');
    if (lastNameError) errors.push(lastNameError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Credentials form validation
export const validateCredentialsForm = (form: {
  professionalNumber: string;
  qualifications: string;
  institution: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const professionalNumberError = validateProfessionalNumber(form.professionalNumber);
  if (professionalNumberError) errors.push(professionalNumberError);

  if (!form.qualifications) {
    errors.push({ field: 'qualifications', message: 'Qualifications are required' });
  }

  const institutionError = validateInstitution(form.institution);
  if (institutionError) errors.push(institutionError);

  return {
    isValid: errors.length === 0,
    errors,
  };
}; 