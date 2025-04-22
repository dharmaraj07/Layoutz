// In a real application, this would be handled by a proper backend
// For this demo, we're using localStorage to simulate server-side auth

// Define the hardcoded credentials
const ADMIN_USERNAME = "Dharmaraj07";
const ADMIN_PASSWORD = "Amaravathi@1";

// Define the auth state interface
interface AuthState {
  authenticated: boolean;
  expiresAt: number;
}

export const login = (username: string, password: string, isRobotVerified: boolean): { success: boolean; message: string } => {
  try {
    // Check if robot verification passed
    if (!isRobotVerified) {
      return { success: false, message: "Please verify that you are not a robot." };
    }
    
    // Check credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return { success: false, message: "Invalid username or password." };
    }
    
    // Set authentication state
    const authExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('adminAuth', JSON.stringify({
      authenticated: true,
      expiresAt: authExpiry
    }));
    
    return { success: true, message: 'Login successful!' };
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const authData = localStorage.getItem('adminAuth');
    
    if (!authData) {
      return false;
    }
    
    const auth = JSON.parse(authData) as AuthState;
    
    if (!auth.authenticated || Date.now() > auth.expiresAt) {
      localStorage.removeItem('adminAuth');
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('adminAuth');
};
