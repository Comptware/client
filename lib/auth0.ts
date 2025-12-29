// lib/auth0.ts
import { Auth0Client } from "@auth0/nextjs-auth0/server";

const requiredEnv = [
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "APP_BASE_URL",
  "AUTH0_SECRET",
  "AUTH0_AUDIENCE",
];
requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing env: ${key}`);
});

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  appBaseUrl: process.env.APP_BASE_URL!,
  secret: process.env.AUTH0_SECRET!,

  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE || "openid profile email",
    audience: process.env.AUTH0_AUDIENCE!,
  },

  // 👇 THIS IS THE NEW WAY TO INCLUDE CUSTOM CLAIMS
  async beforeSessionSaved(session) {
    // session.idTokenClaims contains ALL claims from the raw ID token (including custom ones)
    const idTokenClaims = session.idTokenClaims as Record<string, unknown> | undefined;
    const customRoles = idTokenClaims?.["https://api.suncore.app/roles"];

    if (customRoles && Array.isArray(customRoles)) {
      // Add roles directly to session.user (flattened for easy access)
      session.user["https://api.suncore.app/roles"] = customRoles;
      // OR add a shortcut if you prefer:
      // session.user.roles = customRoles;
    }

    return session;
  },
});


// // // lib/auth0.ts
// import { Auth0Client } from "@auth0/nextjs-auth0/server";

// // ✅ 1. Validate required env variables BEFORE using them
// const requiredEnv = [
//   "AUTH0_DOMAIN",
//   "AUTH0_CLIENT_ID",
//   "AUTH0_CLIENT_SECRET",
//   "APP_BASE_URL",
//   "AUTH0_SECRET",
// ];
// requiredEnv.forEach((key) => {
//   if (!process.env[key]) {
//     throw new Error(`❌ Missing environment variable: ${key}`);
//   }
// });

// // ✅ 2. Initialize Auth0Client with environment variables
// export const auth0 = new Auth0Client({
//   domain: process.env.AUTH0_DOMAIN,
//   clientId: process.env.AUTH0_CLIENT_ID,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET,
//   appBaseUrl: process.env.APP_BASE_URL,
//   secret: process.env.AUTH0_SECRET,
//   authorizationParameters: {
//     scope: process.env.AUTH0_SCOPE,
//     audience: process.env.AUTH0_AUDIENCE,
//   },
// });

