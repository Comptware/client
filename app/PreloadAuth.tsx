// // app/PreloadAuth.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setToken, setUser } from "@/store/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/store/features/auth/authApi";
import { Session } from "@/types";

export function PreloadAuth({ session }: { session: Session }) {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((s) => s.auth);

  // Step 1: Store token from Auth0
  useEffect(() => {
    if (session?.tokenSet?.accessToken && !token) {
      dispatch(setToken(session.tokenSet.accessToken));
    }
  }, [session, token, dispatch]);

  // Step 2: Call RTK Query with token + auth0Id
  const { data: fetchedUser, isSuccess } = useGetCurrentUserQuery(
    {
      token: session?.tokenSet?.accessToken ?? "",
      auth0Id: session?.user?.sub ?? "",
    },
    { skip: !session?.tokenSet?.accessToken }
  );

  // Step 3: Sync to Redux slice for global access
  useEffect(() => {
    if (isSuccess && fetchedUser && !user) {
      dispatch(setUser(fetchedUser));
    }
  }, [fetchedUser, isSuccess, user, dispatch]);

  return null;
}