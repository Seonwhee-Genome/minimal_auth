export type PasswordChecks = {
    length: boolean;
    upper: boolean;
    lower: boolean;
    number: boolean;
    special: boolean;
  };
  
  export function analyzePassword(password: string) {
    const checks: PasswordChecks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  
    const score = Object.values(checks).filter(Boolean).length;
  
    let label = "Weak";
    if (score >= 4) label = "Strong";
    else if (score >= 3) label = "Medium";
  
    return { checks, score, label };
  }