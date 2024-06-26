export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    }
  ],
  links: {
    signIn: "/sign-in",
    signUp: "/sign-up"
  },
}