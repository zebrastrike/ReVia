/**
 * Validate an email address format.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate password strength.
 * Requires at least 8 characters, at least 1 letter, and at least 1 number.
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  return { valid: true };
}

/**
 * Sanitize a string by trimming whitespace and stripping HTML tags/scripts.
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "");
}

/**
 * Validate all required shipping address fields.
 */
export function validateShippingAddress(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Shipping data is required"] };
  }

  const requiredFields = ["name", "email", "address", "city", "state", "zip"] as const;

  for (const field of requiredFields) {
    const value = data[field];
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      errors.push(`Shipping ${field} is required`);
    }
  }

  if (typeof data.email === "string" && data.email.trim().length > 0 && !validateEmail(data.email as string)) {
    errors.push("Invalid shipping email format");
  }

  if (typeof data.zip === "string" && data.zip.trim().length > 0) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test((data.zip as string).trim())) {
      errors.push("Invalid ZIP code format");
    }
  }

  if (typeof data.state === "string" && data.state.trim().length > 0) {
    if ((data.state as string).trim().length < 2) {
      errors.push("State must be at least 2 characters");
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an array of order items.
 */
export function validateOrderItems(items: unknown[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, errors: ["At least one order item is required"] };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown>;

    if (!item || typeof item !== "object") {
      errors.push(`Item ${i + 1}: must be an object`);
      continue;
    }

    if (!item.variantId || typeof item.variantId !== "string") {
      errors.push(`Item ${i + 1}: variantId is required`);
    }
    if (!item.productName || typeof item.productName !== "string") {
      errors.push(`Item ${i + 1}: productName is required`);
    }
    if (!item.variantLabel || typeof item.variantLabel !== "string") {
      errors.push(`Item ${i + 1}: variantLabel is required`);
    }
    if (typeof item.price !== "number" || item.price < 0) {
      errors.push(`Item ${i + 1}: price must be a non-negative number`);
    }
    if (typeof item.quantity !== "number" || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      errors.push(`Item ${i + 1}: quantity must be a positive integer`);
    }
  }

  return { valid: errors.length === 0, errors };
}
