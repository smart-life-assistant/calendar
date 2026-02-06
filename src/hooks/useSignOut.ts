import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import { useTopLoader } from "nextjs-toploader";
import { toast } from "sonner";

interface UseSignOutOptions {
  redirectTo?: string;
  showToast?: boolean;
  toastMessage?: string;
}

export function useSignOut(options?: UseSignOutOptions) {
  const {
    redirectTo = "/login",
    showToast = true,
    toastMessage = "Đang đăng xuất...",
  } = options || {};

  const loader = useTopLoader();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      setIsSigningOut(true);
      loader.start();

      if (showToast) {
        toast.loading(toastMessage, { id: "signout" });
      }

      await signOut({ redirectTo });
    } catch (error) {
      console.error("Sign out error:", error);
      if (showToast) {
        toast.error("Có lỗi xảy ra khi đăng xuất!", { id: "signout" });
      }
    } finally {
      setIsSigningOut(false);
      loader.done();
    }
  }, [redirectTo, showToast, toastMessage, loader]);

  return {
    signOut: handleSignOut,
    isSigningOut,
    loader,
  };
}
