export function FooterCredit() {
  return (
    <>
      Made with ❤️ by{" "}
      <a
        href="https://pietrodev.up.railway.app"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-primary hover:text-primary-bright"
      >
        pietrodev
      </a>
    </>
  );
}

/** Desktop only -- on mobile there's no room to keep this permanently
 * visible without competing with the bottom nav, so it shows up as a
 * regular card on the /about page instead (see AboutView). */
export function Footer() {
  return (
    <footer className="sticky bottom-0 z-10 hidden w-full items-center justify-center border-t border-extra/20 bg-surface/90 p-3 text-center text-xs text-muted backdrop-blur-sm sm:flex">
      <FooterCredit />
    </footer>
  );
}
