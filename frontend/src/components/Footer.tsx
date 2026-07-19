export function Footer() {
  return (
    <footer className="sticky bottom-16 z-10 w-full border-t border-extra/20 bg-surface/90 p-3 text-center text-xs text-muted backdrop-blur-sm sm:bottom-0">
      Made with ❤️ by{" "}
      <a
        href="https://pietrodev.up.railway.app"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-primary hover:text-primary-bright"
      >
        pietrodev
      </a>
    </footer>
  );
}
