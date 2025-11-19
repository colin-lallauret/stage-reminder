'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      window.location.href = `/maps?city=${encodeURIComponent(searchCity)}`;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Header />
      
      <div className="pt-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Trouvez l'entreprise de vos rêves pour votre stage
                </h1>
                <p className="text-lg text-foreground/70">
                  Explorez les entreprises qui ont déjà accueilli des stagiaires de l'UFR Ingémédia. Consultez les emails, les secteurs d'activité et les localités.
                </p>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2 pt-4">
                  <Input
                    type="text"
                    placeholder="Rechercher par ville..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg"
                  />
                  <Button type="submit" className="px-6 py-3">
                    Rechercher
                  </Button>
                </form>

                {/* CTA */}
                <div className="flex gap-4 pt-6">
                  <Link href="/maps">
                    <Button variant="default" size="lg">
                      Voir la carte
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Map Illustration */}
              <div className="hidden md:flex justify-center">
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center border border-border">
                  <svg className="w-64 h-64 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 md:py-20">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi StageReminder ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Recherche rapide', desc: 'Trouvez des entreprises en quelques secondes par ville, domaine ou nom' },
                { title: 'Carte interactive', desc: 'Visualisez toutes les entreprises qui ont déjà accueilli des stagiaires sur une carte du monde' },
                { title: 'Informations détaillées', desc: 'Consultez les emails, les responsables et domaines d\'activité' },
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-card rounded-xl border border-border">
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
