import { useOutletContext } from 'react-router-dom';
import { Layers, Activity, Filter } from 'lucide-react';
import MapVisualization from '../components/MapVisualization';

const MapPage = () => {
    // Context from DashboardLayout
    const { simMode } = useOutletContext<{ simMode: 'desktop' | 'tablet' | 'mobile' }>() || { simMode: 'desktop' };

    return (
        <div className={`h-full w-full flex flex-col pb-4 ${simMode !== 'desktop' ? 'p-4' : 'p-8'}`}>
            <div className={`flex justify-between mb-6 gap-4 ${simMode !== 'desktop' ? 'flex-col items-start' : 'items-end'}`}>
                <div className={simMode !== 'desktop' ? 'w-full' : ''}>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        Live Intelligence Map
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">Geospatial crime prediction and anomaly detection engine.</p>
                </div>
                <div className={`flex gap-3 ${simMode !== 'desktop' ? 'w-full justify-between overflow-x-auto pb-2 custom-scrollbar' : ''}`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/5 hover:border-blue-500/50 transition-all text-[var(--text-secondary)] whitespace-nowrap">
                        <Layers size={16} /> Overlays
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-sm hover:bg-black/5 dark:hover:bg-white/5 hover:border-blue-500/50 transition-all text-[var(--text-secondary)] whitespace-nowrap">
                        <Activity size={16} /> Live Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Main Map Container */}
            <div className="flex-1 w-full bg-[var(--bg-secondary)] backdrop-blur p-4 rounded-3xl border border-[var(--border-primary)] shadow-2xl relative">
                <MapVisualization />
            </div>
        </div>
    );
};

export default MapPage;
