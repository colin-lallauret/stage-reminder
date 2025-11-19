'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

interface MapProps {
  enterprises: Enterprise[];
}

export interface MapRef {
  focusOnEnterprise: (enterpriseId: string) => void;
}

declare global {
  interface Window {
    L?: any;
  }
}

export const MapComponent = forwardRef<MapRef, MapProps>(({ enterprises = [] }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const clusterGroupRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    if (!window.L) {
      // Leaflet CSS
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCss);

      // MarkerCluster CSS
      const clusterCss = document.createElement('link');
      clusterCss.rel = 'stylesheet';
      clusterCss.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
      document.head.appendChild(clusterCss);

      const clusterDefaultCss = document.createElement('link');
      clusterDefaultCss.rel = 'stylesheet';
      clusterDefaultCss.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
      document.head.appendChild(clusterDefaultCss);

      // Leaflet JS
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.onload = () => {
        // MarkerCluster JS
        const clusterScript = document.createElement('script');
        clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
        clusterScript.onload = initMap;
        document.head.appendChild(clusterScript);
      };
      document.head.appendChild(leafletScript);
    } else {
      initMap();
    }
  }, []);

  // Mettre à jour les marqueurs quand la liste des entreprises change
  useEffect(() => {
    if (!map.current || !window.L || enterprises.length === 0) return;

    // Supprimer l'ancien groupe de clusters
    if (clusterGroupRef.current) {
      map.current.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }
    
    // Réinitialiser les marqueurs
    markersRef.current.clear();

    const L = window.L;

    // Créer un groupe de clusters
    const markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50,
      spiderfyDistanceMultiplier: 2,
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        let className = 'marker-cluster-';
        
        if (count < 10) {
          className += 'small';
        } else if (count < 50) {
          className += 'medium';
        } else {
          className += 'large';
        }

        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: 'marker-cluster ' + className,
          iconSize: L.point(40, 40)
        });
      }
    });

    // Ajouter le gestionnaire pour le spiderfy
    markers.on('clusterclick', function(a: any) {
      a.layer.zoomToBounds({ padding: [20, 20] });
      setTimeout(() => {
        a.layer.spiderfy();
      }, 400);
    });

    // Ajouter tous les marqueurs
    enterprises.forEach((enterprise) => {
      if (!enterprise.latitude || !enterprise.longitude) return;

      const customIcon = L.divIcon({
        html: `<div class="custom-marker">
          <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C8.925 0 4 4.925 4 11c0 8.25 11 24 11 24s11-15.75 11-24c0-6.075-4.925-11-11-11z" fill="#3b82f6"/>
            <circle cx="15" cy="11" r="5" fill="white"/>
          </svg>
        </div>`,
        className: 'custom-marker-icon',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([enterprise.latitude, enterprise.longitude], {
        title: enterprise.nom_entrep,
        icon: customIcon
      })
        .bindPopup(
          `<div class="p-2">
            <h3 class="font-bold text-sm">${enterprise.nom_entrep}</h3>
            <p class="text-xs text-gray-600">📍 ${enterprise.ville_entrep}</p>
            ${enterprise.domaine_entrep ? `<p class="text-xs text-gray-600">💼 ${enterprise.domaine_entrep}</p>` : ''}
            ${enterprise.nom_respon ? `<p class="text-xs text-gray-600">👤 ${enterprise.nom_respon}</p>` : ''}
            ${enterprise.mail_respon ? `<p class="text-xs mt-1"><a href="mailto:${enterprise.mail_respon}" class="text-blue-600">✉️ ${enterprise.mail_respon}</a></p>` : ''}
          </div>`
        );

      markers.addLayer(marker);
      markersRef.current.set(enterprise.id, marker);

      marker.on('click', () => {
        setSelectedId(enterprise.id);
      });
    });

    // Ajouter le groupe de clusters à la carte
    map.current.addLayer(markers);
    clusterGroupRef.current = markers;

  }, [enterprises]);

  // Exposer la fonction pour zoomer sur une entreprise
  useImperativeHandle(ref, () => ({
    focusOnEnterprise: (enterpriseId: string) => {
      const marker = markersRef.current.get(enterpriseId);
      const enterprise = enterprises.find(e => e.id === enterpriseId);
      
      if (marker && enterprise && map.current) {
        // Zoomer directement sur les coordonnées de l'entreprise
        map.current.setView([enterprise.latitude, enterprise.longitude], 15, {
          animate: true,
          duration: 0.8
        });
        
        // Attendre la fin de l'animation puis ouvrir le popup
        setTimeout(() => {
          marker.openPopup();
        }, 900);
        
        setSelectedId(enterpriseId);
      }
    }
  }));

  const initMap = () => {
    if (!mapContainer.current || map.current) return;

    const L = window.L;
    
    map.current = L.map(mapContainer.current).setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Les marqueurs seront ajoutés par le useEffect quand enterprises sera disponible
  };

  const handleZoomIn = () => {
    if (map.current) map.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (map.current) map.current.zoomOut();
  };

  const handleReset = () => {
    if (map.current) {
      map.current.setView([20, 0], 2);
      setSelectedId(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 relative">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-slate-100 rounded transition"
          title="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-slate-100 rounded transition"
          title="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-slate-100 rounded transition"
          title="Reset view"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded text-xs text-slate-600 z-10">
        <p className="font-medium mb-2">Commandes:</p>
        <p>🖱️ Cliquez et glissez pour déplacer</p>
        <p>🔄 Double-clic pour zoomer</p>
        <p>🔢 +/- pour contrôler le zoom</p>
      </div>
    </div>
  );
});

MapComponent.displayName = 'MapComponent';
