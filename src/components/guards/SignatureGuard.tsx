'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useGetCartQuery } from '@/store/features/cart/cartApi';

export function SignatureGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAppSelector((s) => s.auth);
  const { data: cart } = useGetCartQuery(undefined, { skip: !token });

  useEffect(() => {
    if (!user) return;
    console.log('Kazmatics got here===')

    // Allow these pages even if not signed (middleware already handles)
    const allowedWithoutSignature = ['/sign-agreement', '/invoice', '/payment', '/bitpay', '/bank-wire'];
    if (allowedWithoutSignature.includes(pathname)) return;

    // Skip public routes
    const publicRoutes = ['/auth/login', '/auth/logout', '/auth/callback'];
    if (publicRoutes.some(route => pathname.startsWith(route))) return;

    // ONLY block if: deposit paid + NOT signed + NOT in payment flow + has remaining balance
    if (
      user.depositPaid && 
      !user.hasSigned && 
      cart && 
      cart.remainingAmount > 0 && 
      !allowedWithoutSignature.includes(pathname)
    ) {
      console.log('🔒 SignatureGuard: Redirecting to /sign-agreement (non-payment route)');
      router.push('/sign-agreement');
      return;
    }

  }, [user, cart, pathname, router]);

  return <>{children}</>;
}




// //src/components/guards/SignatureGuard.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useAppSelector } from '@/store/hooks';

// /**
//  * SignatureGuard - Enforces signature requirement across all protected routes
//  * 
//  * If user has paid deposit but hasn't signed the agreement,
//  * they will be locked to the /sign-agreement page and cannot access
//  * any other protected routes until signing is complete.
//  */
// export function SignatureGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   // const { user, loading } = useAppSelector((s) => s.auth); // loading does not exist in auth slice, you may add it and update other places if needed
//   const { user } = useAppSelector((s) => s.auth);

//   useEffect(() => {
//     // // Don't redirect while loading user data
//     // if (loading) return;

//     // Don't redirect if no user (auth middleware will handle this)
//     if (!user) return;

//     // Allow access to sign-agreement page itself
//     if (pathname === '/sign-agreement') return;

//     // Allow access to public routes
//     const publicRoutes = ['/auth/login', '/auth/logout', '/auth/callback'];
//     if (publicRoutes.some(route => pathname.startsWith(route))) return;

//     // ENFORCE: If deposit paid but not signed, lock to sign-agreement page
//     if (user.depositPaid && !user.hasSigned) {
//       console.log('🔒 Signature required - redirecting to /sign-agreement');
//       router.push('/sign-agreement');
//       return;
//     }

//     // If signed, allow access to all routes
//   // }, [user, loading, pathname, router]);
//   }, [user, pathname, router]);

//   return <>{children}</>;
// }
