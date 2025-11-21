import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo et nom */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <Image
              src="/stagereminder.png"
              alt="StageReminder Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-foreground">StageReminder</span>
          </Link>

          {/* Copyright et Admin */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="text-sm text-foreground/60 text-center md:text-right">
              © {currentYear} par Colin LALLAURET. All rights reserved.
            </div>
            <Link 
              href="/admin" 
              className="text-xs text-foreground/60 hover:text-foreground/80 transition-colors underline"
            >
              Espace admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
