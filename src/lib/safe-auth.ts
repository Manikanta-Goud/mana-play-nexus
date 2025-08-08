// Safe auth service that doesn't initialize Appwrite on admin routes
export const safeAuthService = {
  isAdminRoute: () => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/admin');
  },

  shouldInitializeAppwrite: () => {
    return !safeAuthService.isAdminRoute();
  }
};

export default safeAuthService;
