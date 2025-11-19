'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
      <Header />

      <div className="flex h-screen pt-20">
        {/* Sidebar with filters */}
        <div className="w-full md:w-80 bg-card border-r border-border p-6 overflow-y-auto">
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
              <ThemeProvider theme={muiTheme}>
                <Autocomplete
                  multiple
                  id="domain-select"
                  options={availableDomains}
                  value={searchDomains}
                  onChange={(event, newValue) => {
                    setSearchDomains(newValue);
                  }}
                  disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Sélectionner des domaines..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          minHeight: '36px',
                          height: 'auto',
                          width: '100%',
                          minWidth: '0',
                          backgroundColor: 'transparent',
                          color: 'hsl(var(--foreground))',
                          fontSize: '0.875rem',
                          padding: '0.15rem 0.5rem',
                          paddingRight: '35px',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                          transition: 'color 0.2s, box-shadow 0.2s',
                          '& fieldset': {
                            borderColor: 'hsl(var(--input))',
                            borderWidth: '1px',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                          },
                          '&:hover fieldset': {
                            borderColor: 'hsl(var(--input))',
                          },
                          '&.Mui-focused': {
                            outline: 'none',
                            '& fieldset': {
                              borderColor: 'hsl(var(--ring))',
                              borderWidth: '1px',
                            },
                            boxShadow: '0 0 0 3px hsl(var(--ring) / 0.5)',
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '0.25rem 0.25rem',
                            height: 'auto',
                            fontSize: '0.875rem',
                            color: 'hsl(var(--foreground))',
                            '&::placeholder': {
                              color: 'hsl(var(--muted-foreground))',
                              opacity: 1,
                            },
                          },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                        size="small"
                        sx={{
                          height: '22px',
                          margin: '2px',
                          fontSize: '0.75rem',
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                          borderRadius: '0.25rem',
                          '& .MuiChip-label': {
                            padding: '0 6px',
                          },
                          '& .MuiChip-deleteIcon': {
                            width: '14px',
                            height: '14px',
                            margin: '0 4px 0 -2px',
                            color: 'hsl(var(--primary-foreground))',
                            '&:hover': {
                              color: 'hsl(var(--primary-foreground))',
                              opacity: 0.7,
                            },
                          },
                        }}
                      />
                    ))
                  }
                  sx={{
                    '& .MuiAutocomplete-popupIndicator': {
                      color: 'hsl(var(--muted-foreground))',
                      padding: '2px',
                    },
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'hsl(var(--muted-foreground))',
                      padding: '2px',
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      right: '6px !important',
                      top: 'calc(50% - 14px)',
                    },
                  }}
                  ListboxProps={{
                    sx: {
                      maxHeight: '300px',
                      backgroundColor: 'hsl(var(--popover))',
                      color: 'hsl(var(--popover-foreground))',
                      padding: '4px',
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.875rem',
                        padding: '6px 10px',
                        borderRadius: '0.25rem',
                        minHeight: '32px',
                        '&:hover': {
                          backgroundColor: 'hsl(var(--accent))',
                        },
                        '&[aria-selected="true"]': {
                          backgroundColor: 'hsl(var(--accent))',
                          fontWeight: '500',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'hsl(var(--accent))',
                        },
                      },
                    },
                  }}
                  componentsProps={{
                    paper: {
                      sx: {
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        marginTop: '4px',
                      },
                    },
                  }}
                />
              </ThemeProvider>
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
        <div className="md:hidden flex-1 flex items-center justify-center p-4">
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
        <Header />
        <div className="flex h-screen pt-20 items-center justify-center">
          <p>Chargement...</p>
        </div>
      </main>
    }>
      <MapsPageContent />
    </Suspense>
  );
}
