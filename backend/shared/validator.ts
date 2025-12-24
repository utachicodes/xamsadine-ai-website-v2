/**
 * Input Validation & Sanitization Module
 * Provides type-safe validation for all user inputs
 * Prevents injection attacks and malformed data
 */

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: string[];
  custom?: (value: any) => boolean | string;
}

/**
 * Validator class for safe input handling
 */
export class Validator {
  /**
   * Validate string input
   */
  static validateString(value: any, field: string, rules: ValidationRule = {}): string {
    if (rules.required && (!value || value.trim() === '')) {
      throw new ValidationError(`${field} is required`, field, 'REQUIRED');
    }

    if (!value) return '';

    // Ensure it's a string
    const str = String(value).trim();

    if (rules.minLength && str.length < rules.minLength) {
      throw new ValidationError(
        `${field} must be at least ${rules.minLength} characters`,
        field,
        'MIN_LENGTH'
      );
    }

    if (rules.maxLength && str.length > rules.maxLength) {
      throw new ValidationError(
        `${field} must not exceed ${rules.maxLength} characters`,
        field,
        'MAX_LENGTH'
      );
    }

    if (rules.pattern && !rules.pattern.test(str)) {
      throw new ValidationError(`${field} format is invalid`, field, 'INVALID_FORMAT');
    }

    if (rules.enum && !rules.enum.includes(str)) {
      throw new ValidationError(
        `${field} must be one of: ${rules.enum.join(', ')}`,
        field,
        'INVALID_ENUM'
      );
    }

    if (rules.custom) {
      const result = rules.custom(str);
      if (result !== true) {
        const message = typeof result === 'string' ? result : `${field} is invalid`;
        throw new ValidationError(message, field, 'CUSTOM_VALIDATION');
      }
    }

    return str;
  }

  /**
   * Validate number input
   */
  static validateNumber(
    value: any,
    field: string,
    rules: { required?: boolean; min?: number; max?: number } = {}
  ): number {
    if (rules.required && value === null && value === undefined) {
      throw new ValidationError(`${field} is required`, field, 'REQUIRED');
    }

    if (value === null || value === undefined) return 0;

    const num = Number(value);

    if (isNaN(num)) {
      throw new ValidationError(`${field} must be a number`, field, 'INVALID_NUMBER');
    }

    if (rules.min !== undefined && num < rules.min) {
      throw new ValidationError(`${field} must be at least ${rules.min}`, field, 'MIN_VALUE');
    }

    if (rules.max !== undefined && num > rules.max) {
      throw new ValidationError(`${field} must not exceed ${rules.max}`, field, 'MAX_VALUE');
    }

    return num;
  }

  /**
   * Validate boolean input
   */
  static validateBoolean(value: any, field: string, required: boolean = false): boolean {
    if (required && value === null && value === undefined) {
      throw new ValidationError(`${field} is required`, field, 'REQUIRED');
    }

    if (value === null || value === undefined) return false;

    if (typeof value === 'boolean') return value;

    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (lower === 'true') return true;
      if (lower === 'false') return false;
    }

    throw new ValidationError(`${field} must be a boolean`, field, 'INVALID_BOOLEAN');
  }

  /**
   * Validate array input
   */
  static validateArray<T>(
    value: any,
    field: string,
    rules: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      itemValidator?: (item: any, index: number) => T;
    } = {}
  ): T[] {
    if (rules.required && (!Array.isArray(value) || value.length === 0)) {
      throw new ValidationError(`${field} is required`, field, 'REQUIRED');
    }

    if (!Array.isArray(value)) {
      throw new ValidationError(`${field} must be an array`, field, 'INVALID_ARRAY');
    }

    if (rules.minLength && value.length < rules.minLength) {
      throw new ValidationError(
        `${field} must have at least ${rules.minLength} items`,
        field,
        'MIN_LENGTH'
      );
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      throw new ValidationError(
        `${field} must not exceed ${rules.maxLength} items`,
        field,
        'MAX_LENGTH'
      );
    }

    if (rules.itemValidator) {
      return value.map((item, index) => rules.itemValidator!(item, index));
    }

    return value as T[];
  }

  /**
   * Validate email address
   */
  static validateEmail(value: any, field: string, required: boolean = false): string {
    const str = this.validateString(value, field, { required });

    if (str) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(str)) {
        throw new ValidationError(`${field} must be a valid email address`, field, 'INVALID_EMAIL');
      }
    }

    return str;
  }

  /**
   * Validate URL
   */
  static validateURL(value: any, field: string, required: boolean = false): string {
    const str = this.validateString(value, field, { required });

    if (str) {
      try {
        new URL(str);
      } catch {
        throw new ValidationError(`${field} must be a valid URL`, field, 'INVALID_URL');
      }
    }

    return str;
  }

  /**
   * Sanitize string to prevent XSS
   */
  static sanitizeString(value: string): string {
    if (!value) return '';

    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate object with schema
   */
  static validateObject<T extends Record<string, any>>(
    value: any,
    schema: Record<keyof T, ValidationRule>,
    field: string = 'object'
  ): T {
    if (typeof value !== 'object' || value === null) {
      throw new ValidationError(`${field} must be an object`, field, 'INVALID_OBJECT');
    }

    const result: any = {};

    for (const [key, rule] of Object.entries(schema)) {
      const fieldName = `${field}.${key}`;
      const fieldValue = value[key];

      if (rule.required && fieldValue === undefined) {
        throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
      }

      if (rule.custom && fieldValue !== undefined) {
        const validationResult = rule.custom(fieldValue);
        if (validationResult !== true) {
          const message = typeof validationResult === 'string' ? validationResult : `${fieldName} is invalid`;
          throw new ValidationError(message, fieldName, 'CUSTOM_VALIDATION');
        }
        result[key] = fieldValue;
      } else if (fieldValue !== undefined) {
        result[key] = fieldValue;
      }
    }

    return result as T;
  }
}

export default Validator;
