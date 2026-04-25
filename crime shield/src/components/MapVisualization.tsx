import { MapContainer, TileLayer, Marker, Tooltip as LeafletTooltip } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '../context/ThemeContext';

const hotspots = [
    { id: 1, lat: 6.5244, lng: 3.3792, severity: 'high', label: 'Lagos Island', active: true, prob: '89.4%', crimePercentage: 72 },
    { id: 2, lat: 9.0765, lng: 7.3985, severity: 'medium', label: 'Abuja Central', active: true, prob: '65.2%', crimePercentage: 45 },
    { id: 3, lat: 12.0022, lng: 8.5920, severity: 'critical', label: 'Kano Transit', active: true, prob: '96.1%', crimePercentage: 88 },
    { id: 4, lat: 7.3775, lng: 3.9470, severity: 'low', label: 'Ibadan Residential', active: false, prob: '12.5%', crimePercentage: 15 },
    { id: 5, lat: 4.8156, lng: 7.0498, severity: 'medium', label: 'Port Harcourt Oil Field', active: true, prob: '58.9%', crimePercentage: 52 },
    { id: 6, lat: 6.3350, lng: 5.6037, severity: 'high', label: 'Benin City Core', active: true, prob: '82.3%', crimePercentage: 68 },
];

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'critical': return 'rgba(168,85,247,0.8)';
        case 'high': return 'rgba(239,68,68,0.8)';
        case 'medium': return 'rgba(245,158,11,0.8)';
        case 'low': return 'rgba(59,130,246,0.8)';
        default: return 'rgba(100,116,139,0.8)';
    }
};

const createCustomIcon = (severity: string, active: boolean) => {
    const color = getSeverityColor(severity);
    const ring = active && (severity === 'critical' || severity === 'high')
        ? `<div class="absolute inset-0 rounded-full border-2 animate-ping opacity-75" style="border-color: ${color};"></div>`
        : '';

    const html = `
    <div class="relative w-6 h-6 flex items-center justify-center pointer-events-none">
      ${ring}
      <div class="w-4 h-4 rounded-full" style="background-color: ${color}; box-shadow: 0 0 15px ${color};"></div>
    </div>
  `;

    return L.divIcon({
        html,
        className: 'custom-leaflet-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const MapVisualization = () => {
    // Abuja Coordinates
    const center: [number, number] = [9.0765, 7.3985];
    const { theme } = useTheme();

    return (
        <div className="w-full h-full relative rounded-2xl overflow-hidden border border-[var(--border-primary)]">

            <MapContainer
                center={center}
                zoom={13}
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url={theme === 'dark'
                        ? "https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
                        : "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    }
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />

                {hotspots.map((spot) => (
                    <Marker
                        key={spot.id}
                        position={[spot.lat, spot.lng]}
                        icon={createCustomIcon(spot.severity, spot.active)}
                    >
                        <LeafletTooltip
                            direction="top"
                            offset={[0, -10]}
                            opacity={1}
                            className="custom-tooltip bg-[var(--bg-secondary)] backdrop-blur-md border border-[var(--border-primary)] shadow-2xl rounded-xl p-0"
                        >
                            <div className="p-3 w-48 text-left">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-xs text-[var(--text-primary)] leading-tight">{spot.label}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${spot.severity === 'critical' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' :
                                        spot.severity === 'high' ? 'bg-red-500/20 text-red-600 dark:text-red-300' :
                                            spot.severity === 'medium' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300' :
                                                'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                                        }`}>
                                        {spot.severity}
                                    </span>
                                </div>
                                <p className="text-[10px] text-[var(--text-secondary)] whitespace-normal">Probability of incident within 2hrs based on historic correlation.</p>

                                <div className="mt-2 pt-2 border-t border-[var(--border-primary)] flex flex-col gap-1 text-[10px] text-[var(--text-primary)]">
                                    <div className="flex justify-between">
                                        <span>Crime Rate:</span>
                                        <span className="font-mono text-red-500 font-bold">{spot.crimePercentage}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>AI Confidence:</span>
                                        <span className="font-mono text-blue-600 dark:text-blue-400">{spot.prob}</span>
                                    </div>
                                </div>
                            </div>
                        </LeafletTooltip>
                    </Marker>
                ))}
            </MapContainer>

            {/* HUD Info built over the map */}
            <div className="absolute top-4 left-4 z-[400] pointer-events-none">
                <div className="bg-[var(--bg-secondary)]/80 backdrop-blur border border-[var(--border-primary)] rounded-lg p-3 w-48 shadow-lg">
                    <div className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-wider mb-2">Live Sensors</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[var(--text-primary)] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Critical</span>
                            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">1</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[var(--text-primary)] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span> High Risk</span>
                            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">2</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-[var(--text-primary)] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> Moderate</span>
                            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">2</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Apply custom css for removing leaflet tooltip default styling */}
            <style>{`
  .leaflet-tooltip.custom-tooltip {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
  }
  .leaflet-tooltip-top::before {
    border-top-color: #1e293b;
    bottom: -6px;
  }
`}</style>
        </div>
    );
};

export default MapVisualization;
