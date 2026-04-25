import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Route as RouteIcon, MapPin, Navigation, ShieldCheck, ArrowRight, Shield, Loader2, ChevronRight, Compass } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

interface RouteStep {
    instruction: string;
    distance: number;
    location: [number, number];
}

interface RouteOption {
    id: string;
    name: string;
    time: string;
    distance: string;
    riskScore: string;
    color: string;
    incidents: number;
    recommended: boolean;
    steps: RouteStep[];
}

const initialRoutesData: RouteOption[] = [
    {
        id: 'route-1',
        name: 'Safest Route',
        time: '121 min',
        distance: '166.1 km',
        riskScore: 'Low Risk',
        color: 'safe',
        incidents: 0,
        recommended: true,
        steps: []
    },
    {
        id: 'route-2',
        name: 'Optimized Shield',
        time: '115 min',
        distance: '162.4 km',
        riskScore: 'Mid Risk',
        color: 'warning',
        incidents: 4,
        recommended: false,
        steps: []
    },
    {
        id: 'route-3',
        name: 'Urban Alternative',
        time: '135 min',
        distance: '170.2 km',
        riskScore: 'Mid Risk',
        color: 'warning',
        incidents: 7,
        recommended: false,
        steps: []
    },
    {
        id: 'route-4',
        name: 'High-Speed Path',
        time: '108 min',
        distance: '158.9 km',
        riskScore: 'High Risk',
        color: 'danger',
        incidents: 12,
        recommended: false,
        steps: []
    },
    {
        id: 'route-5',
        name: 'Tactical Bypass',
        time: '145 min',
        distance: '182.5 km',
        riskScore: 'Critical Risk',
        color: 'danger',
        incidents: 18,
        recommended: false,
        steps: []
    }
];

const initialRouteCoords: Record<string, [number, number][]> = {
    'route-1': [
        [9.0765, 7.3985],
        [8.4900, 7.0500],
        [8.0500, 6.7500]
    ],
    'route-2': [
        [9.0765, 7.3985],
        [8.4000, 7.2000],
        [8.0500, 6.7500]
    ],
    'route-3': [
        [9.0765, 7.3985],
        [8.6000, 7.5000],
        [8.0500, 6.7500]
    ],
    'route-4': [
        [9.0765, 7.3985],
        [8.3000, 6.9000],
        [8.0500, 6.7500]
    ],
    'route-5': [
        [9.0765, 7.3985],
        [8.7000, 7.8000],
        [8.0500, 6.7500]
    ]
};

const vehicleIcon = L.divIcon({
    html: `<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] text-white border-2 border-white ring-4 ring-blue-500/20"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation-2"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg></div>`,
    className: 'vehicle-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const startIcon = L.divIcon({
    html: `<div class="w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-400"></div>`,
    className: 'start-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const endIcon = L.divIcon({
    html: `<div class="w-6 h-6 rounded-full bg-slate-950 border-2 border-danger flex items-center justify-center"><div class="w-2 h-2 bg-danger rounded-full animate-ping"></div></div>`,
    className: 'end-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const stepIcon = L.divIcon({
    html: `<div class="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>`,
    className: 'step-marker',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

// Component to dynamically fit map to coordinates
const MapBoundsUpdater = ({ coords, trigger }: { coords: [number, number][] | undefined, trigger: any }) => {
    const map = useMap();
    useEffect(() => {
        if (coords && coords.length > 0) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [100, 100], animate: true, duration: 1.5 });
        }
    }, [trigger, map]);
    return null;
};

const RoutesPage = () => {
    // Context from DashboardLayout
    const { simMode } = useOutletContext<{ simMode: 'desktop' | 'tablet' | 'mobile' }>() || { simMode: 'desktop' };

    const [selectedRoute, setSelectedRoute] = useState('route-1');
    const [startInput, setStartInput] = useState('Lagos, Nigeria');
    const [endInput, setEndInput] = useState('Abuja, Nigeria');
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const [dynamicRoutes, setDynamicRoutes] = useState<RouteOption[]>(initialRoutesData);
    const [dynamicCoords, setDynamicCoords] = useState<Record<string, [number, number][]>>(initialRouteCoords);
    const [mapCenter, setMapCenter] = useState<[number, number]>([9.0765, 7.3985]);
    const [boundsTrigger, setBoundsTrigger] = useState(0);

    // Navigation State
    const [, setNavProgress] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [vehiclePos, setVehiclePos] = useState<[number, number] | null>(null);

    const getRouteColor = (id: string, idx: number) => {
        if (id === 'route-1' || idx === 0) return '#3b82f6'; // Premium Blue
        if (id === 'route-2' || idx === 1) return '#ef4444'; // Danger
        return '#f59e0b'; // Warning
    };

    // Navigation Loop
    useEffect(() => {
        if (!isNavigating || !dynamicCoords[selectedRoute]) return;

        let animationFrameId: number;
        const startTime = Date.now();
        const duration = 20000; // 20 seconds for full route demo

        const animate = () => {
            const now = Date.now();
            const elapsed = (now - startTime) % duration;
            const progress = elapsed / duration;
            setNavProgress(progress);

            const path = dynamicCoords[selectedRoute];
            const totalSegments = path.length - 1;
            const scaledProgress = progress * totalSegments;
            const segment = Math.min(Math.floor(scaledProgress), totalSegments - 1);
            const segProg = scaledProgress - segment;

            const start = path[segment];
            const end = path[segment + 1];

            if (start && end) {
                const lat = start[0] + (end[0] - start[0]) * segProg;
                const lng = start[1] + (end[1] - start[1]) * segProg;
                setVehiclePos([lat, lng]);

                // Find closest step
                const steps = dynamicRoutes.find(r => r.id === selectedRoute)?.steps || [];
                if (steps.length > 0) {
                    const stepIdx = Math.min(Math.floor(progress * steps.length), steps.length - 1);
                    setCurrentStepIndex(stepIdx);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isNavigating, selectedRoute, dynamicCoords, dynamicRoutes]);

    const calculateRoutes = async () => {
        if (!startInput || !endInput) return;
        setIsLoading(true);
        try {
            const startRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startInput)}`);
            const startData = await startRes.json();
            const endRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endInput)}`);
            const endData = await endRes.json();

            if (startData.length === 0 || endData.length === 0) {
                setIsLoading(false);
                return;
            }

            const sLat = parseFloat(startData[0].lat);
            const sLon = parseFloat(startData[0].lon);
            const eLat = parseFloat(endData[0].lat);
            const eLon = parseFloat(endData[0].lon);

            const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${sLon},${sLat};${eLon},${eLat}?overview=full&geometries=geojson&steps=true&alternatives=true`);
            const osrmData = await osrmRes.json();

            if (osrmData.code === 'Ok') {
                const newCoords: Record<string, [number, number][]> = {};
                const newRoutesData: RouteOption[] = [];

                // Ensure we have 5 routes even if OSRM gives fewer
                const rawRoutes = osrmData.routes;
                const totalDesired = 5;
                
                for (let i = 0; i < totalDesired; i++) {
                    const route = rawRoutes[i % rawRoutes.length]; // Cycle through OSRM routes if needed
                    const id = `route-${i + 1}`;
                    
                    // Add slight random perturbation to coordinates for synthetic routes if they're recycled
                    const coords: [number, number][] = route.geometry.coordinates.map((c: any) => {
                        const lat = i > 0 ? c[1] + (Math.random() - 0.5) * 0.002 * i : c[1];
                        const lon = i > 0 ? c[0] + (Math.random() - 0.5) * 0.002 * i : c[0];
                        return [lat, lon];
                    });
                    newCoords[id] = coords;

                    const steps: RouteStep[] = [];
                    route.legs[0].steps.forEach((s: any) => {
                        steps.push({
                            instruction: s.maneuver.instruction || (s.maneuver.type + " " + s.maneuver.modifier),
                            distance: s.distance,
                            location: [s.maneuver.location[1], s.maneuver.location[0]]
                        });
                    });

                    // Dynamic property assignment based on index
                    const names = ['Safest Path', 'Optimized Shield', 'Urban Alternative', 'High-Speed Path', 'Tactical Bypass'];
                    const incidents = i === 0 ? 0 : i === 1 ? 5 : i === 2 ? 12 : i === 3 ? 18 : 25;
                    const resolveRate = i === 0 ? 98 : i === 1 ? 85 : i === 2 ? 65 : i === 3 ? 45 : 30;
                    
                    let riskScore = 'Safe';
                    let color = 'safe';
                    
                    if (incidents >= 20 || resolveRate < 40) {
                        riskScore = 'Critical Risk';
                        color = 'danger';
                    } else if (incidents >= 15 || resolveRate < 60) {
                        riskScore = 'High Risk';
                        color = 'danger';
                    } else if (incidents >= 5 || resolveRate < 85) {
                        riskScore = 'Mid Risk';
                        color = 'warning';
                    }

                    newRoutesData.push({
                        id,
                        name: names[i] || `Alternative Path ${i + 1}`,
                        time: Math.round(route.duration / 60 + (i * 5)) + ' min', // add penalty for alternatives
                        distance: (route.distance / 1000 + (i * 0.5)).toFixed(1) + ' km',
                        riskScore: `${riskScore} (${resolveRate}% Resolve)`,
                        color,
                        incidents,
                        recommended: i === 0,
                        steps
                    });
                }

                setDynamicCoords(newCoords);
                setDynamicRoutes(newRoutesData);
                setSelectedRoute('route-1');
                setMapCenter([sLat, sLon]);
                setBoundsTrigger(p => p + 1);
            }
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    const activeRoute = dynamicRoutes.find(r => r.id === selectedRoute);
    const currentStep = activeRoute?.steps[currentStepIndex];

    return (
        <div className={`h-full w-full flex flex-col pb-4 bg-[var(--bg-primary)] ${simMode === 'mobile' ? 'p-4' : 'p-8'}`}>
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h1 className={`${simMode === 'mobile' ? 'text-2xl mt-4' : 'text-3xl'} font-bold text-[var(--text-primary)] tracking-tight`}>
                        Safe Route Planning
                    </h1>
                    <p className={`${simMode === 'mobile' ? 'text-xs mt-2' : 'text-sm mt-1'} text-[var(--text-secondary)] flex items-center gap-2`}>
                        <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                        AI-powered real-time threat avoidance navigation.
                    </p>
                </div>
            </div>

            <div className={`flex-1 grid grid-cols-1 ${simMode === 'desktop' ? (isNavigating ? 'lg:grid-cols-1' : 'lg:grid-cols-3') : 'lg:grid-cols-1'} gap-6 mb-4`}>
                {!isNavigating && (
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 rounded-2xl shadow-2xl">
                            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">Trip Configuration</h3>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></div>
                                    <input
                                        type="text"
                                        value={startInput}
                                        onChange={(e) => setStartInput(e.target.value)}
                                        className="w-full bg-black/20 border border-[var(--border-primary)] rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2"><MapPin size={14} className="text-danger" /></div>
                                    <input
                                        type="text"
                                        value={endInput}
                                        onChange={(e) => setEndInput(e.target.value)}
                                        className="w-full bg-black/20 border border-[var(--border-primary)] rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <button
                                    onClick={calculateRoutes}
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RouteIcon size={18} />}
                                    {isLoading ? "Analyzing Safety Matrix..." : "Calculate Best Route"}
                                </button>
                            </div>
                        </div>

                        <div className={`bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl flex-col flex ${simMode === 'desktop' ? 'flex-1 overflow-hidden' : 'h-64'}`}>
                            <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between shrink-0">
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Suggested Routes</h3>
                            </div>
                            <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
                                {dynamicRoutes.map(route => (
                                    <div
                                        key={route.id}
                                        onClick={() => setSelectedRoute(route.id)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRoute === route.id
                                                ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10'
                                                : 'bg-black/20 border-transparent hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm tracking-tight">{route.name}</h4>
                                            <span className="text-lg font-black">{route.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold">
                                            <span className="flex items-center gap-1 text-[var(--text-secondary)]"><Navigation size={10} /> {route.distance}</span>
                                            <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${route.color === 'safe' ? 'bg-safe/20 text-safe' : 'bg-warning/20 text-warning'
                                                }`}>
                                                <Shield size={8} /> {route.riskScore}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className={`${isNavigating ? 'lg:col-span-1' : (simMode === 'desktop' ? 'lg:col-span-2' : 'lg:col-span-1')} bg-black border border-[var(--border-primary)] rounded-2xl shadow-2xl relative overflow-hidden ${simMode !== 'desktop' && !isNavigating ? 'min-h-[400px]' : ''}`}>
                    <MapContainer
                        center={mapCenter}
                        zoom={15}
                        style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} />

                        {dynamicCoords[selectedRoute] && <MapBoundsUpdater coords={dynamicCoords[selectedRoute]} trigger={boundsTrigger} />}

                        {Object.entries(dynamicCoords).map(([id, coords], idx) => (
                            <Polyline
                                key={id}
                                positions={coords}
                                pathOptions={{
                                    color: getRouteColor(id, idx),
                                    weight: selectedRoute === id ? 6 : 3,
                                    opacity: selectedRoute === id ? 1 : 0.3,
                                    lineJoin: 'round'
                                }}
                            />
                        ))}

                        {dynamicCoords[selectedRoute] && (
                            <>
                                <Marker position={dynamicCoords[selectedRoute][0]} icon={startIcon} />
                                <Marker position={dynamicCoords[selectedRoute][dynamicCoords[selectedRoute].length - 1]} icon={endIcon} />
                            </>
                        )}

                        {isNavigating && activeRoute?.steps.map((s, i) => (
                            <Marker key={i} position={s.location} icon={stepIcon} />
                        ))}

                        {isNavigating && vehiclePos && (
                            <Marker position={vehiclePos} icon={vehicleIcon} zIndexOffset={1000} />
                        )}
                    </MapContainer>

                    {/* Real-time Navigation Overlay */}
                    <div className="absolute z-[1000] bottom-6 left-6 right-6">
                        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-5 w-full md:w-auto">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isNavigating ? 'bg-blue-600 animate-pulse' : 'bg-white/5'}`}>
                                    {isNavigating ? <Compass size={28} className="text-white" /> : <Navigation size={28} className="text-white/20" />}
                                </div>
                                <div className="flex-1">
                                    {isNavigating && currentStep ? (
                                        <div className="animate-in slide-in-from-bottom-2 duration-300">
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Current Instruction</p>
                                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                                {currentStep.instruction}
                                                <ChevronRight size={18} className="text-white/20" />
                                            </h4>
                                            <p className="text-xs text-white/40 font-medium">In {Math.round(currentStep.distance)} meters • Safest Route Active</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">System Status</p>
                                            <h4 className="text-lg font-bold text-white/60">Ready for Departure</h4>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`flex items-center gap-3 w-full ${simMode !== 'desktop' ? 'flex-col gap-4' : 'md:w-auto'}`}>
                                <div className={`${simMode !== 'desktop' ? 'w-full text-center border-b pb-4' : 'hidden md:block text-right mr-2 border-r pr-4'} border-white/10`}>
                                    <p className="text-[10px] font-bold text-white/30 uppercase">ETD Intelligence</p>
                                    <p className={`${simMode !== 'desktop' ? 'text-2xl mt-1' : 'text-sm'} font-black text-white`}>{activeRoute?.time || '--'}</p>
                                </div>
                                {isNavigating ? (
                                    <button
                                        onClick={() => setIsNavigating(false)}
                                        className="w-full md:w-auto px-8 py-3 bg-danger hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-danger/20 flex items-center justify-center gap-2"
                                    >
                                        End Trip
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (!activeRoute) return;
                                            setIsNavigating(true);
                                            setNavProgress(0);
                                        }}
                                        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                    >
                                        Start Navigation <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutesPage;
