// Helper functions for Apple ID creation

/**
 * Convert Shamsi/Jalali date to Gregorian
 * Input format: YYYY/MM/DD (e.g., 1380/05/15)
 * Output format: YYYY-MM-DD (e.g., 2001-08-06)
 */
export function shamsiToGregorian(shamsiDate: string): string {
  try {
    const parts = shamsiDate.split('/');
    if (parts.length !== 3) throw new Error('Invalid date format');

    const jy = parseInt(parts[0]);
    const jm = parseInt(parts[1]);
    const jd = parseInt(parts[2]);

    // Jalali to Gregorian conversion algorithm
    const gy = jy <= 979 ? 621 : 1600;
    let jy2 = jy <= 979 ? jy + 4281 - 979 : jy - 1600;
    
    const days = (365 * jy2) + (~~(jy2 / 33) * 8) + ~~((jy2 % 33 + 3) / 4) + 78 + jd;
    const gd = (jm < 7) ? days + (jm - 1) * 31 : days + ((jm - 7) * 30) + 186;
    
    let gy2 = 400 * ~~(gd / 146097);
    let gd2 = gd % 146097;
    
    if (gd2 >= 36525) {
      gy2 += 100 * ~~(--gd2 / 36524);
      gd2 = gd2 % 36524;
      if (gd2 >= 365) gd2++;
    }
    
    gy2 += 4 * ~~(gd2 / 1461);
    gd2 %= 1461;
    
    if (gd2 >= 366) {
      gy2 += ~~((gd2 - 1) / 365);
      gd2 = (gd2 - 1) % 365;
    }
    
    const finalGy = gy + gy2;
    const sal_a = [0, 31, (finalGy % 4 === 0 && finalGy % 100 !== 0) || (finalGy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    let gm = 0;
    for (let i = 0; gd2 >= sal_a[i] && i < 13; i++) {
      gd2 -= sal_a[i];
      gm++;
    }
    
    const finalGd = gd2 + 1;
    
    const month = gm.toString().padStart(2, '0');
    const day = finalGd.toString().padStart(2, '0');
    
    return `${finalGy}-${month}-${day}`;
  } catch (error) {
    console.error('Error converting Shamsi to Gregorian:', error);
    return '';
  }
}

/**
 * Generate a medium-strength password
 * Length: 10 characters
 * Contains: uppercase, lowercase, numbers, and symbols
 */
export function generatePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '@#$%&*';
  
  // Ensure at least one of each type
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest with random characters
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < 10; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Generate security questions and answers based on user's name
 * Creates 3 unique question-answer pairs
 */
export function generateSecurityQuestions(name: string): {
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  question3: string;
  answer3: string;
} {
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts[nameParts.length - 1] || 'Name';
  
  // Generate random numbers and words for variety
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const randomColor = ['Blue', 'Red', 'Green', 'Yellow', 'Purple'][Math.floor(Math.random() * 5)];
  const randomCity = ['Tehran', 'Isfahan', 'Shiraz', 'Mashhad', 'Tabriz'][Math.floor(Math.random() * 5)];
  
  return {
    question1: "What is your favorite color?",
    answer1: randomColor,
    question2: "What city were you born in?",
    answer2: randomCity,
    question3: "What is your lucky number?",
    answer3: randomNumber.toString()
  };
}

/**
 * Validate Shamsi date format
 */
export function isValidShamsiDate(date: string): boolean {
  const parts = date.split('/');
  if (parts.length !== 3) return false;
  
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (year < 1300 || year > 1450) return false; // Reasonable range
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  return true;
}
