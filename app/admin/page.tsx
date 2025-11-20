'use client';

import { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface Enterprise {
  id: string;
  nom_entrep: string;
  ville_entrep: string;
  nom_respon?: string;
  mail_respon?: string;
  domaine_entrep?: string;
  latitude?: number;
  longitude?: number;
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Enterprise>>({});
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setAuthenticated(true);
      fetchEnterprises();
    };

    checkAuth();
  }, []);

  const fetchEnterprises = async () => {
    try {
      const res = await fetch('/api/entreprises');
      const data = await res.json();
      setEnterprises(data || []);
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.nom_entrep || !formData.ville_entrep) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      const res = await fetch('/api/entreprises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add');

      setFormData({});
      fetchEnterprises();
    } catch (error) {
      console.error('Error adding:', error);
      alert('Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      const res = await fetch(`/api/entreprises/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      fetchEnterprises();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const res = await fetch(`/api/entreprises/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update');

      setEditingId(null);
      setFormData({});
      fetchEnterprises();
    } catch (error) {
      console.error('Error updating:', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data as any[];
          let successCount = 0;
          let errorCount = 0;

          for (const row of data) {
            // Vérifier que les champs obligatoires sont présents
            if (!row.nom_entrep || !row.ville_entrep) {
              errorCount++;
              continue;
            }

            const enterprise = {
              nom_entrep: row.nom_entrep,
              ville_entrep: row.ville_entrep,
              nom_respon: row.nom_respon || null,
              mail_respon: row.mail_respon || null,
              domaine_entrep: row.domaine_entrep || null,
              latitude: row.latitude ? parseFloat(row.latitude) : null,
              longitude: row.longitude ? parseFloat(row.longitude) : null,
            };

            try {
              const res = await fetch('/api/entreprises', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enterprise),
              });

              if (res.ok) {
                successCount++;
              } else {
                errorCount++;
              }
            } catch (error) {
              errorCount++;
            }
          }

          alert(
            `Import terminé!\n✅ ${successCount} entreprise(s) ajoutée(s)\n❌ ${errorCount} erreur(s)`
          );

          fetchEnterprises();
        } catch (error) {
          console.error('Error importing CSV:', error);
          alert('Erreur lors de l\'import du fichier CSV');
        } finally {
          setImporting(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Erreur lors de la lecture du fichier CSV');
        setImporting(false);
      },
    });
  };

  const handleDeleteAll = async () => {
    const confirmText = `Êtes-vous ABSOLUMENT sûr de vouloir supprimer TOUTES les ${enterprises.length} entreprises ?\n\nCette action est IRRÉVERSIBLE !`;
    
    if (!confirm(confirmText)) return;

    // Double confirmation
    const doubleConfirm = prompt(
      `Pour confirmer, tapez "SUPPRIMER TOUT" (en majuscules) :`
    );

    if (doubleConfirm !== 'SUPPRIMER TOUT') {
      alert('Suppression annulée. Le texte ne correspond pas.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/entreprises/delete-all', {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }

      alert(`✅ Toutes les entreprises ont été supprimées avec succès !`);
      fetchEnterprises();
    } catch (error) {
      console.error('Error deleting all:', error);
      alert(`❌ Erreur lors de la suppression : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 px-4 flex items-center justify-center">
          <p>Vérification...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des entreprises</h1>
            
            {/* Import CSV Button */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
                id="csv-upload"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="flex items-center gap-2 cursor-pointer"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Importer CSV
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                disabled={importing || loading || enterprises.length === 0}
                className="flex items-center gap-2"
              >
                🗑️ Tout supprimer
              </Button>
            </div>
          </div>

          {/* CSV Format Info */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex gap-2 items-start">
              <FileSpreadsheet className="text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
              <div className="text-sm flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Format du fichier CSV attendu :
                </p>
                <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded">
                  nom_entrep, ville_entrep, nom_respon, mail_respon, domaine_entrep, latitude, longitude
                </code>
                <p className="text-blue-700 dark:text-blue-300 mt-2">
                  • Les champs <strong>nom_entrep</strong> et <strong>ville_entrep</strong> sont obligatoires
                  <br />• Les autres champs sont optionnels
                </p>
                <a
                  href="/exemple_entreprises.csv"
                  download
                  className="inline-flex items-center gap-1 mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  📥 Télécharger un fichier exemple
                </a>
              </div>
            </div>
          </div>

          {/* Form for adding/editing */}
          <div ref={formSectionRef} className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="font-bold text-lg mb-4">
              {editingId ? 'Modifier' : 'Ajouter une'} entreprise
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Nom *</label>
                <Input
                  value={formData.nom_entrep || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_entrep: e.target.value })
                  }
                  placeholder="Nom de l'entreprise"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Ville *</label>
                <Input
                  value={formData.ville_entrep || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, ville_entrep: e.target.value })
                  }
                  placeholder="Ville"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Responsable</label>
                <Input
                  value={formData.nom_respon || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_respon: e.target.value })
                  }
                  placeholder="Nom du responsable"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.mail_respon || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, mail_respon: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Domaine</label>
                <Input
                  value={formData.domaine_entrep || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, domaine_entrep: e.target.value })
                  }
                  placeholder="Domaine d'activité"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Latitude</label>
                  <Input
                    type="number"
                    value={formData.latitude || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: parseFloat(e.target.value) })
                    }
                    placeholder="Latitude"
                    step="0.0001"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Longitude</label>
                  <Input
                    type="number"
                    value={formData.longitude || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: parseFloat(e.target.value) })
                    }
                    placeholder="Longitude"
                    step="0.0001"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              {editingId ? (
                <>
                  <Button onClick={handleUpdate}>Mettre à jour</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({});
                    }}
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <Button onClick={handleAdd}>Ajouter</Button>
              )}
            </div>
          </div>

          {/* Enterprises list */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Entreprise</th>
                    <th className="px-4 py-3 text-left font-medium">Ville</th>
                    <th className="px-4 py-3 text-left font-medium">Domaine</th>
                    <th className="px-4 py-3 text-left font-medium">Responsable</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enterprises.map((enterprise) => (
                    <tr key={enterprise.id} className="border-b border-border hover:bg-background">
                      <td className="px-4 py-3">{enterprise.nom_entrep}</td>
                      <td className="px-4 py-3">{enterprise.ville_entrep}</td>
                      <td className="px-4 py-3">{enterprise.domaine_entrep || '-'}</td>
                      <td className="px-4 py-3">{enterprise.nom_respon || '-'}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => {
                            setEditingId(enterprise.id);
                            setFormData(enterprise);
                            formSectionRef.current?.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }}
                        >
                          Éditer
                        </Button>
                        <Button
                          size="sm"
                          className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-white"
                          onClick={() => handleDelete(enterprise.id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
