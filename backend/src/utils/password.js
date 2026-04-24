import bcrypt from 'bcrypt';
import config from '../config.json' with { type: 'json' };

/**
 * Utility function to hash a password before saving to the database
 * @param {string} plainTextPassword - The password from the user's request body
 * @returns {Promise<string>} - The securely hashed password
 */
export const hash = async (plainTextPassword) => {
  try {
    // 1. Define the "cost factor" (salt rounds).
    // A higher number means more security but also more time to hash.
    const saltRounds = config.cryptography.hashCost || 10;

    // 2. Generate the random salt
    const salt = await bcrypt.genSalt(saltRounds);

    // 3. Hash the plain password combining it with the generated salt
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const compare = async (plainTextPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    return false;
  }
};