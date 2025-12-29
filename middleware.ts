// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";
import { getCurrentUserWithCart } from "@/api/client";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  let pathname = url.pathname;

  // Clean _rsc param and _next/data paths
  if (url.searchParams.has("_rsc")) {
    url.searchParams.delete("_rsc");
  }
  if (pathname.startsWith("/_next/data/")) {
    const match = pathname.match(/\/_next\/data\/[^/]+\/(.*)\.json$/);
    if (match) pathname = `/${match[1]}`;
  }

  const effectivePath = pathname;
  const origin = request.nextUrl.origin;

  console.log(`Middleware → ${effectivePath} (original: ${request.nextUrl.pathname}${request.nextUrl.search})`);

  // === EARLY BYPASS FOR ONBOARDING + PUBLIC ROUTES ===
  // These routes are fully controlled by our custom middleware logic
  const onboardingAndPublicPaths = [
    "/",
    "/products",
    "/invoice",
    "/payment",
    "/bitpay",
    "/bank-wire",
    "/kyc",
    "/sign-agreement",
    "/error",
  ];

  const isOnboardingOrPublic = 
    onboardingAndPublicPaths.includes(effectivePath) ||
    effectivePath.startsWith("/products");

  // Always let Auth0 handle /auth routes
  if (effectivePath.startsWith("/auth")) {
    return auth0.middleware(request);
  }

  // For onboarding/public routes: skip Auth0 session check entirely
  // (prevents RSC session loss bug in production)
  if (isOnboardingOrPublic) {
    // We will handle auth and flow below — just continue
  } else {
    // For all other routes (dashboard, ops, etc.): require valid Auth0 session
    const session = await auth0.getSession(request);
    if (!session?.user) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }
  }

  // === Now run full custom flow logic (only for logged-in or onboarding users) ===

  // Get session (safe to call again — cached in request)
  const session = await auth0.getSession(request);

  // Public unauthenticated access
  if (!session?.user) {
    if (effectivePath === "/" || effectivePath.startsWith("/products")) {
      return NextResponse.next();
    }
    // Should not reach here for onboarding paths due to early bypass
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const token = session.tokenSet.accessToken;
  const roles = (session.user?.["https://api.suncore.app/roles"] as string[]) ?? [];
  const isAdmin = roles.includes("ADMIN") || roles.includes("OPERATIONS");
  const isClient = roles.length === 0;

  // Admin routing
  if (isAdmin) {
    if (!effectivePath.startsWith("/ops")) {
      return NextResponse.redirect(`${origin}/ops`);
    }
    return NextResponse.next();
  }

  // Block normal users from /ops
  if (effectivePath.startsWith("/ops")) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

// Client onboarding flow — only for actual app pages (not assets)
if (isClient && isOnboardingOrPublic) {
  let user, cart;
  try {
    const data = await getCurrentUserWithCart(token);
    console.log(`Payment lock check: path=${effectivePath}, remaining=${data.cart?.remainingAmount || 0}`);
    user = data.user;
    cart = data.cart;
  } catch (err) {
    console.error("Failed to fetch user in middleware:", err);
    return NextResponse.redirect(`${origin}/error`);
  }

  const redirectIfNotCurrent = (target: string) => {
    if (effectivePath !== target) {
      return NextResponse.redirect(`${origin}${target}`);
    }
    return null;
  };

  if (!user.depositPaid && !cart) {
    const res = redirectIfNotCurrent("/products");
    if (res) return res;
  }
  else if (user.kycStatus !== "APPROVED") {
    const res = redirectIfNotCurrent("/kyc");
    if (res) return res;
  }
  else if (user.kycStatus === "APPROVED" && cart && cart.depositApplied === 0) {
    const res = redirectIfNotCurrent("/payment");
    if (res) return res;
  }
  else if (user.depositPaid && !user.hasSigned) {
    const res = redirectIfNotCurrent("/sign-agreement");
    if (res) return res;
  }
  // Payment pending lock
  else if (user.hasSigned && cart && cart.remainingAmount > 0) {
    const allowed = ["/invoice", "/payment", "/bitpay", "/bank-wire"];

    if (allowed.includes(effectivePath)) {
      console.log("Allowed: exact path match");
      return NextResponse.next();
    }

    // RSC detection
    const isRscRequest = 
      request.nextUrl.searchParams.has("_rsc") ||
      request.headers.get("rsc") || 
      request.headers.get("next-router-state-tree") ||
      request.headers.get("next-router-prefetch") === "1";

    if (isRscRequest) {
      console.log("Allowed: RSC request");
      return NextResponse.next();
    }

    console.log("Blocked: redirecting to /invoice");
    return NextResponse.redirect(`${origin}/invoice`);
  }
}

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};