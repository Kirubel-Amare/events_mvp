import { USERNAME_REGEX } from './constants';

export class Validators {
  // Validate email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate username
  static isValidUsername(username: string): boolean {
    return USERNAME_REGEX.test(username) && username.length >= 3 && username.length <= 30;
  }

  // Validate password
  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  // Validate URL
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validate date is in future
  static isFutureDate(date: Date): boolean {
    return date > new Date();
  }

  // Validate date is within reasonable range (next 5 years)
  static isValidEventDate(date: Date): boolean {
    const now = new Date();
    const fiveYearsLater = new Date();
    fiveYearsLater.setFullYear(now.getFullYear() + 5);
    return date > now && date <= fiveYearsLater;
  }

  // Validate capacity
  static isValidCapacity(capacity: number): boolean {
    return capacity > 0 && capacity <= 100000;
  }
}