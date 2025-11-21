'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ne pas afficher l'avertissement sur la homepage
  if (!isMobile || pathname === '/') return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#F83975] to-[#44A7E0] rounded-full flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[#1E3664] mb-3">
            StageReminder
          </h1>
          <p className="text-xl font-semibold text-foreground mb-2">
            Version mobile non disponible
          </p>
          <p className="text-foreground/70 leading-relaxed">
            Pour une expérience optimale avec la carte interactive et toutes les fonctionnalités, 
            veuillez accéder à StageReminder depuis un ordinateur.
          </p>
        </div>

        <div className="pt-4 text-sm text-foreground/60">
          💻 Disponible sur PC uniquement
        </div>
      </div>
    </div>
  );
}
