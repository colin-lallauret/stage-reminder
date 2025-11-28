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
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl bg-white/80 backdrop-blur-xl rounded-full shadow-sm border border-gray-200/50">
      <div className="px-8 py-3 flex items-center justify-between">
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
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <HeroButton 
                variant="flat"
                className="flex items-center gap-1 px-4 py-2 text-sm text-foreground hover:text-primary transition-all duration-200 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full hover:border-primary hover:shadow-md cursor-pointer h-auto min-w-0"
              >
                <span>Une ville ?</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </HeroButton>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner une ville"
              onAction={(key) => handleCitySelect(key as string)}
              className="max-h-80 overflow-y-auto bg-white shadow-lg max-w-xs"
              itemClasses={{
                base: "bg-white hover:bg-gray-100 whitespace-normal"
              }}
            >
              {cities.map((city) => (
                <DropdownItem key={city}>{city}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <HeroButton 
                variant="flat"
                className="flex items-center gap-1 px-4 py-2 text-sm text-foreground hover:text-primary transition-all duration-200 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full hover:border-primary hover:shadow-md cursor-pointer h-auto min-w-0"
              >
                <span>Un domaine ?</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </HeroButton>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner un domaine"
              onAction={(key) => handleDomainSelect(key as string)}
              className="max-h-80 overflow-y-auto bg-white shadow-lg max-w-xs"
              itemClasses={{
                base: "bg-white hover:bg-gray-100 whitespace-normal"
              }}
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

          <button
            onClick={() => router.push('/maps')}
            className="flex items-center gap-3 px-5 py-2.5 bg-[#F83975] text-white rounded-full hover:bg-[#E02864] transition-all duration-200 shadow-md hover:shadow-lg font-medium cursor-pointer"
          >
            <span>Rechercher une entreprise</span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[#F83975] text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              <span>+900</span>
            </div>
          </button>
          
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
          className="md:hidden cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <HeroButton 
                variant="flat"
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-foreground hover:text-primary transition-all duration-200 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full hover:border-primary hover:shadow-md cursor-pointer h-auto min-w-0"
              >
                <span>Une ville ?</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </HeroButton>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner une ville"
              onAction={(key) => {
                handleCitySelect(key as string);
                setIsOpen(false);
              }}
              className="max-h-80 overflow-y-auto bg-white shadow-lg max-w-xs"
              itemClasses={{
                base: "bg-white hover:bg-gray-100 whitespace-normal"
              }}
            >
              {cities.map((city) => (
                <DropdownItem key={city}>{city}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <HeroButton 
                variant="flat"
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-foreground hover:text-primary transition-all duration-200 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full hover:border-primary hover:shadow-md cursor-pointer h-auto min-w-0"
              >
                <span>Un domaine ?</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </HeroButton>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Sélectionner un domaine"
              onAction={(key) => {
                handleDomainSelect(key as string);
                setIsOpen(false);
              }}
              className="max-h-80 overflow-y-auto bg-white shadow-lg max-w-xs"
              itemClasses={{
                base: "bg-white hover:bg-gray-100 whitespace-normal"
              }}
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

          <button
            onClick={() => {
              router.push('/maps');
              setIsOpen(false);
            }}
            className="flex items-center justify-between w-full px-5 py-3 bg-[#F83975] text-white rounded-full hover:bg-[#E02864] transition-all duration-200 shadow-md hover:shadow-lg font-medium cursor-pointer"
          >
            <span>Rechercher une entreprise</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-[#F83975] text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              <span>+900</span>
            </div>
          </button>
          
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
