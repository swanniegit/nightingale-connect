import {
  validateEmail,
  validatePassword,
  validateName,
  validateProfessionalNumber,
  validateInstitution,
  validateAuthForm,
  validateCredentialsForm,
  ValidationError
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name@domain.co.za')).toBeNull();
      expect(validateEmail('test+tag@example.org')).toBeNull();
    });

    it('should return error for empty email', () => {
      const result = validateEmail('');
      expect(result).toEqual({
        field: 'email',
        message: 'Email is required'
      });
    });

    it('should return error for invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result).toEqual({
        field: 'email',
        message: 'Please enter a valid email address'
      });
    });

    it('should return error for email without domain', () => {
      const result = validateEmail('test@');
      expect(result).toEqual({
        field: 'email',
        message: 'Please enter a valid email address'
      });
    });
  });

  describe('validatePassword', () => {
    it('should return null for valid password', () => {
      expect(validatePassword('password123')).toBeNull();
      expect(validatePassword('securePass!')).toBeNull();
      expect(validatePassword('123456')).toBeNull(); // Minimum length
    });

    it('should return error for empty password', () => {
      const result = validatePassword('');
      expect(result).toEqual({
        field: 'password',
        message: 'Password is required'
      });
    });

    it('should return error for password too short', () => {
      const result = validatePassword('12345');
      expect(result).toEqual({
        field: 'password',
        message: 'Password must be at least 6 characters long'
      });
    });
  });

  describe('validateName', () => {
    it('should return null for valid names', () => {
      expect(validateName('John', 'firstName')).toBeNull();
      expect(validateName('Van Der Merwe', 'lastName')).toBeNull();
      expect(validateName('Dr Sarah', 'firstName')).toBeNull();
    });

    it('should return error for empty name', () => {
      const result = validateName('', 'firstName');
      expect(result).toEqual({
        field: 'firstName',
        message: 'Firstname is required'
      });
    });

    it('should return error for name too short', () => {
      const result = validateName('A', 'firstName');
      expect(result).toEqual({
        field: 'firstName',
        message: 'Firstname must be at least 2 characters long'
      });
    });

    it('should return error for name with invalid characters', () => {
      const result = validateName('John123', 'firstName');
      expect(result).toEqual({
        field: 'firstName',
        message: 'Firstname can only contain letters and spaces'
      });
    });
  });

  describe('validateProfessionalNumber', () => {
    it('should return null for valid professional numbers', () => {
      expect(validateProfessionalNumber('SANC12345')).toBeNull();
      expect(validateProfessionalNumber('123456789')).toBeNull();
    });

    it('should return error for empty professional number', () => {
      const result = validateProfessionalNumber('');
      expect(result).toEqual({
        field: 'professionalNumber',
        message: 'Professional registration number is required'
      });
    });

    it('should return error for professional number too short', () => {
      const result = validateProfessionalNumber('1234');
      expect(result).toEqual({
        field: 'professionalNumber',
        message: 'Professional registration number must be at least 5 characters long'
      });
    });
  });

  describe('validateInstitution', () => {
    it('should return null for valid institutions', () => {
      expect(validateInstitution('University of Cape Town')).toBeNull();
      expect(validateInstitution('Groote Schuur Hospital')).toBeNull();
    });

    it('should return error for empty institution', () => {
      const result = validateInstitution('');
      expect(result).toEqual({
        field: 'institution',
        message: 'Institution is required'
      });
    });

    it('should return error for institution too short', () => {
      const result = validateInstitution('AB');
      expect(result).toEqual({
        field: 'institution',
        message: 'Institution name must be at least 3 characters long'
      });
    });
  });

  describe('validateAuthForm', () => {
    it('should return valid result for complete form', () => {
      const form = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      const result = validateAuthForm(form);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid form', () => {
      const form = {
        email: 'invalid-email',
        password: '123',
        firstName: 'J',
        lastName: 'D'
      };
      
      const result = validateAuthForm(form);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors).toContainEqual({
        field: 'email',
        message: 'Please enter a valid email address'
      });
    });

    it('should validate partial form (login only)', () => {
      const form = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = validateAuthForm(form);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateCredentialsForm', () => {
    it('should return valid result for complete form', () => {
      const form = {
        professionalNumber: 'SANC12345',
        qualifications: 'Bachelor of Nursing Science',
        institution: 'University of Cape Town'
      };
      
      const result = validateCredentialsForm(form);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid form', () => {
      const form = {
        professionalNumber: '123',
        qualifications: '',
        institution: 'AB'
      };
      
      const result = validateCredentialsForm(form);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });
}); 