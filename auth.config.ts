import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';
      const isSetupPage = nextUrl.pathname === '/admin/setup';
      const isSetupApi = nextUrl.pathname === '/api/admin/setup';

      // Setup page and its API are always public
      if (isSetupPage || isSetupApi) return true;

      if (isAdminRoute && !isLoginPage) {
        if (isLoggedIn) return true;
        return false;
      }
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
