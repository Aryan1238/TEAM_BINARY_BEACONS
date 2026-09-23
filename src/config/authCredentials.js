/**
 * Client-Side Demo Role Authentication Configuration
 * 
 * NOTE: DEMO CREDENTIALS — replace with real auth for production.
 * This provides a lightweight client-side gate for hackathon demo evaluation.
 * Session state is stored in sessionStorage (clears automatically when the browser closes).
 */

export const DEMO_CREDENTIALS = {
  farmer: {
    role: 'farmer',
    label: 'Farmer',
    icon: '🌾',
    username: 'farmer',
    password: 'farmer123',
    dashboardTitle: 'Farmer Workspace',
    description: 'Field management, disease alerts & Crop Health Passports'
  },
  officer: {
    role: 'officer',
    label: 'Extension Officer',
    icon: '🧑‍🌾',
    username: 'officer',
    password: 'officer123',
    dashboardTitle: 'Extension Officer Workspace',
    description: 'Village survey intake, outbreak triage & SMS broadcasts'
  },
  govt: {
    role: 'govt',
    label: 'State Government',
    icon: '🏛️',
    username: 'govt',
    password: 'govt123',
    dashboardTitle: 'Government Command Center',
    description: 'Epidemiological hotspot analytics & pesticide supply'
  }
};

/**
 * Returns whether a role is authenticated for the current browser session.
 * @param {string} role - 'farmer' | 'officer' | 'govt'
 * @returns {boolean}
 */
export const isRoleAuthenticated = (role) => {
  if (typeof window === 'undefined' || !role) return false;
  try {
    return sessionStorage.getItem(`krushi_auth_${role.toLowerCase()}`) === 'true';
  } catch (_) {
    return false;
  }
};

/**
 * Validates credentials against demo credentials and stores authentication in sessionStorage.
 * @param {string} role - 'farmer' | 'officer' | 'govt'
 * @param {string} username
 * @param {string} password
 * @returns {{ success: boolean, message?: string }}
 */
export const authenticateRole = (role, username, password) => {
  const normalizedRole = role?.toLowerCase();
  const creds = DEMO_CREDENTIALS[normalizedRole];
  
  if (!creds) {
    return { success: false, message: 'Invalid workspace role specified.' };
  }

  // Exact matching against demo credentials (case-insensitive for username, exact for password)
  const isUserValid = (username || '').trim().toLowerCase() === creds.username.toLowerCase();
  const isPassValid = (password || '') === creds.password;

  if (isUserValid && isPassValid) {
    try {
      sessionStorage.setItem(`krushi_auth_${normalizedRole}`, 'true');
    } catch (_) {}
    return { success: true };
  }

  return { success: false, message: 'Invalid credentials' };
};

/**
 * Clears authentication for a specific role or all roles.
 * @param {string} [role] - 'farmer' | 'officer' | 'govt'
 */
export const logoutRole = (role) => {
  if (typeof window === 'undefined') return;
  try {
    if (role) {
      sessionStorage.removeItem(`krushi_auth_${role.toLowerCase()}`);
    } else {
      ['farmer', 'officer', 'govt'].forEach((r) => {
        sessionStorage.removeItem(`krushi_auth_${r}`);
      });
    }
  } catch (_) {}
};

/**
 * Returns the demo credentials object for a given role (used for UI placeholders).
 * @param {string} role
 * @returns {{ username: string, password: string, label: string, icon: string } | null}
 */
export const getDemoCredentials = (role) => {
  return DEMO_CREDENTIALS[role?.toLowerCase()] || null;
};
