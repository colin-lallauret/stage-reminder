'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Button as HeroButton } from '@heroui/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [domains, setDomains] = useState<string[]>([]);
  const supabase = createClient();
  const router = useRouter();

  const cities = [
    'Paris',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Montpellier',
    'Strasbourg',
    'Bordeaux',
    'Lille',
    'Rennes',
    'Toulon',
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    const fetchDomains = async () => {
      try {
        const res = await fetch('/api/entreprises/domaines');
        const data = await res.json();
        setDomains(data || []);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };

    checkAuth();
    fetchDomains();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const handleCitySelect = (city: string) => {
    router.push(`/maps?city=${encodeURIComponent(city)}`);
  };

  const handleDomainSelect = (domain: string) => {
    router.push(`/maps?domain=${encodeURIComponent(domain)}`);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Image
            src="/stagereminder.png"
            alt="StageReminder Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span>StageReminder</span>
        </Link>

        <nav className="hidden md:flex gap-4 items-center">
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground hover:text-primary transition-colors border border-border rounded-lg hover:border-primary">
                <span>Une ville ?</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner une ville"
              onAction={(key) => handleCitySelect(key as string)}
              className="max-h-80 overflow-y-auto"
            >
              {cities.map((city) => (
                <DropdownItem key={city}>{city}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground hover:text-primary transition-colors border border-border rounded-lg hover:border-primary">
                <span>Un domaine ?</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner un domaine"
              onAction={(key) => handleDomainSelect(key as string)}
              className="max-h-80 overflow-y-auto"
            >
              {domains.length > 0 ? (
                domains.map((domain) => (
                  <DropdownItem key={domain}>{domain}</DropdownItem>
                ))
              ) : (
                <DropdownItem key="loading" isDisabled>Chargement...</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>

          <HeroButton
            onClick={() => router.push('/maps')}
            className="bg-gradient-to-r from-[#429BDB] to-[#E95188] text-white shadow-lg font-medium"
            radius="full"
            size="sm"
          >
            🗺️ Carte
          </HeroButton>
          
          {isAuthenticated && (
            <>
              <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                Admin
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
              >
                Déconnexion
              </Button>
            </>
          )}
        </nav>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4">
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-foreground hover:text-primary transition-colors border border-border rounded-lg hover:border-primary">
                <span>Une ville ?</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner une ville"
              onAction={(key) => {
                handleCitySelect(key as string);
                setIsOpen(false);
              }}
              className="max-h-80 overflow-y-auto"
            >
              {cities.map((city) => (
                <DropdownItem key={city}>{city}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-foreground hover:text-primary transition-colors border border-border rounded-lg hover:border-primary">
                <span>Un domaine ?</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner un domaine"
              onAction={(key) => {
                handleDomainSelect(key as string);
                setIsOpen(false);
              }}
              className="max-h-80 overflow-y-auto"
            >
              {domains.length > 0 ? (
                domains.map((domain) => (
                  <DropdownItem key={domain}>{domain}</DropdownItem>
                ))
              ) : (
                <DropdownItem key="loading" isDisabled>Chargement...</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>

          <HeroButton
            onClick={() => {
              router.push('/maps');
              setIsOpen(false);
            }}
            className="bg-gradient-to-r from-[#429BDB] to-[#E95188] text-white shadow-lg font-medium w-full"
            radius="full"
            size="md"
          >
            🗺️ Carte
          </HeroButton>
          
          {isAuthenticated && (
            <>
              <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                Admin
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Déconnexion
              </Button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
