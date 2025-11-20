'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapComponent, MapRef } from '@/components/map';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import './map-styles.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Enterprise {
  id: string;
  nom_entrep: string;
  ville_entrep: string;
  latitude: number;
  longitude: number;
  nom_respon?: string;
  mail_respon?: string;
  domaine_entrep?: string;
}

function MapsPageContent() {
  const searchParams = useSearchParams();
  const { theme, systemTheme } = useTheme();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [filteredEnterprises, setFilteredEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState(searchParams.get('city') || '');
  const [searchDomains, setSearchDomains] = useState<string[]>(
    searchParams.get('domain') ? [searchParams.get('domain')!] : []
  );
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [searchName, setSearchName] = useState('');
  const mapRef = useRef<MapRef>(null);

  // Déterminer si le thème est sombre
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  // Créer un thème Material UI adapté
  const muiTheme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const res = await fetch('/api/entreprises');
        const data = await res.json();
        setEnterprises(data || []);
        setFilteredEnterprises(data || []);
      } catch (error) {
        console.error('Error fetching enterprises:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDomains = async () => {
      try {
        const res = await fetch('/api/entreprises/domaines');
        const domains = await res.json();
        setAvailableDomains(domains || []);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };

    fetchEnterprises();
    fetchDomains();
  }, []);

  useEffect(() => {
    let filtered = enterprises;

    if (searchCity) {
      filtered = filtered.filter(e =>
        e.ville_entrep?.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    if (searchDomains.length > 0) {
      filtered = filtered.filter(e =>
        e.domaine_entrep && searchDomains.some(domain =>
          e.domaine_entrep?.toLowerCase().includes(domain.toLowerCase())
        )
      );
    }

    if (searchName) {
      filtered = filtered.filter(e =>
        e.nom_entrep?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredEnterprises(filtered);
  }, [searchCity, searchDomains, searchName, enterprises]);

  const handleEnterpriseClick = (enterpriseId: string) => {
    if (mapRef.current) {
      mapRef.current.focusOnEnterprise(enterpriseId);
    }
  };

  const handleSearchCity = () => {
    if (!searchCity.trim() || filteredEnterprises.length === 0 || !mapRef.current) return;

    // Trouver toutes les entreprises de la ville recherchée
    const cityEnterprises = filteredEnterprises.filter(e => 
      e.ville_entrep?.toLowerCase().includes(searchCity.toLowerCase())
    );

    if (cityEnterprises.length > 0) {
      // Zoomer sur la première entreprise de la ville
      const firstEnterprise = cityEnterprises[0];
      mapRef.current.focusOnEnterprise(firstEnterprise.id);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar with filters */}
        <div className="w-full md:w-80 bg-card border-r border-border p-6 overflow-y-auto">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/stagereminder.png"
                alt="StageReminder Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-xl">StageReminder</span>
            </Link>
          </div>
          
          <h2 className="font-bold text-xl mb-6">Filtres</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Ville</label>
              <Input
                type="text"
                placeholder="Rechercher une ville..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchCity();
                  }
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Domaine</label>
              <div className="relative">
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <input
                    type="text"
                    placeholder="Rechercher des domaines..."
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    onFocus={(e) => {
                      const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                      if (dropdown) dropdown.style.display = 'block';
                    }}
                  />
                </div>
                <div className="hidden absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md border border-input bg-background shadow-lg">
                  {availableDomains.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => {
                        if (searchDomains.includes(domain)) {
                          setSearchDomains(searchDomains.filter(d => d !== domain));
                        } else {
                          setSearchDomains([...searchDomains, domain]);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${
                        searchDomains.includes(domain) ? 'bg-accent font-medium' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded border ${
                          searchDomains.includes(domain) 
                            ? 'bg-primary border-primary' 
                            : 'border-input'
                        }`}>
                          {searchDomains.includes(domain) && (
                            <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {domain}
                      </span>
                    </button>
                  ))}
                </div>
                {searchDomains.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {searchDomains.map((domain) => (
                      <span
                        key={domain}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md"
                      >
                        {domain}
                        <button
                          onClick={() => setSearchDomains(searchDomains.filter(d => d !== domain))}
                          className="hover:opacity-70 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Entreprise</label>
              <Input
                type="text"
                placeholder="Rechercher une entreprise..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleSearchCity}
              className="w-full"
              variant="default"
              disabled={!searchCity.trim() || filteredEnterprises.length === 0}
            >
              🔍 Rechercher sur la carte
            </Button>

            <Button 
              onClick={() => {
                setSearchCity('');
                setSearchDomains([]);
                setSearchName('');
              }}
              variant="outline"
              className="w-full"
            >
              Réinitialiser
            </Button>
          </div>

          {/* Results list */}
          <div className="mt-8">
            <h3 className="font-bold mb-4">Résultats ({filteredEnterprises.length})</h3>
            <div className="space-y-2">
              {filteredEnterprises.map((enterprise) => (
                <button
                  key={enterprise.id}
                  onClick={() => handleEnterpriseClick(enterprise.id)}
                  className="enterprise-result-item w-full p-3 bg-background rounded border border-border text-sm text-left hover:bg-accent hover:border-primary transition-all cursor-pointer"
                >
                  <p className="font-medium">{enterprise.nom_entrep}</p>
                  <p className="text-xs text-foreground/60">{enterprise.ville_entrep}</p>
                  {enterprise.domaine_entrep && (
                    <p className="text-xs text-foreground/60 mt-1">{enterprise.domaine_entrep}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="hidden md:flex flex-1 relative">
          {loading ? (
            <div className="w-full flex items-center justify-center">
              <p>Chargement de la carte...</p>
            </div>
          ) : (
            <MapComponent ref={mapRef} enterprises={filteredEnterprises} />
          )}
        </div>

        {/* Mobile notice */}
        <div className="md:hidden flex-1 flex items-center justify-center p-4 mt-24">
          <p className="text-center text-foreground/60">
            La carte est disponible sur les appareils desktop. Utilisez les filtres pour rechercher des entreprises.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function MapsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <div className="flex h-screen items-center justify-center">
          <p>Chargement...</p>
        </div>
      </main>
    }>
      <MapsPageContent />
    </Suspense>
  );
}
