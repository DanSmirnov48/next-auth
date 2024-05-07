"use client";

import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";
import { UserAccountNav } from "./auth/user-account-nav";
import LoginButton from "./auth/login-button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function SiteHeader() {
  const user = useCurrentUser();
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <UserAccountNav user={user} />
            ) : (
              <LoginButton mode="redirect">
                <Button size={'sm'}>Sign In</Button>
              </LoginButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
