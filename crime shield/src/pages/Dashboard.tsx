import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Shield, Target, AlertOctagon, TrendingUp, Newspaper, Loader2, CheckCircle2 } from 'lucide-react';
import IncidentChart from '../components/IncidentChart';
import CrimeTypeChart from '../components/CrimeTypeChart';
import RecentAlerts, { initialAlerts } from '../components/RecentAlerts';
import AlertDetailModal from '../components/AlertDetailModal';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-primary)] p-6 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl group-hover:bg-blue-500/10 transition-colors">
                <Icon className="text-blue-500" size={24} />
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${trend === 'up' ? 'text-danger bg-danger/10' : 'text-safe bg-safe/10'}`}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                {change}
            </div>
        </div>
        <div>
            <p className="text-[var(--text-secondary)] text-sm mb-1 font-medium">{title}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
        </div>
    </div>
);



const Dashboard = () => {
    // Determine context simMode matching layout wrapper

    const [selectedIncident, setSelectedIncident] = useState<any>(null);
    const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
    const [alerts, setAlerts] = useState(initialAlerts);
    const [isFetching, setIsFetching] = useState(false);

    // Context from DashboardLayout
    const { simMode } = useOutletContext<{ simMode: 'desktop' | 'tablet' | 'mobile' }>() || { simMode: 'desktop' };

    const handleAutofetch = () => {
        setIsFetching(true);
        // Simulate news fetching delay
        setTimeout(() => {
            const newsIncidents = [
                {
                    id: Date.now(),
                    type: 'Moderate',
                    severity: 'Moderate' as const,
                    title: 'Newspaper Report: Warehouse Fire',
                    location: 'Industrial District',
                    time: 'Just now',
                    description: 'Local newspaper reports a localized fire at a textile warehouse. Firefighters are on scene. No casualties reported yet.'
                },
                {
                    id: Date.now() + 1,
                    type: 'High',
                    severity: 'High' as const,
                    title: 'Breaking News: Bank Heist',
                    location: 'Financial Center',
                    time: 'Just now',
                    description: 'Live news update: Multiple suspects involved in a bank heist. Negotiators are currently on site. Area is cordoned off.'
                }
            ];
            setAlerts((prev: any) => [...newsIncidents, ...prev]);
            setIsFetching(false);
        }, 1500);
    };

    return (
        <div className={`h-full overflow-y-auto ${simMode === 'mobile' ? 'p-4' : 'p-8'}`}>

            <AlertDetailModal
                isOpen={isIncidentModalOpen}
                onClose={() => setIsIncidentModalOpen(false)}
                alert={selectedIncident}
            />
            <div className={`flex items-center mb-8 gap-4 ${simMode === 'mobile' ? 'flex-col justify-start' : 'flex-row justify-between md:items-end'}`}>
                <div className={`w-full ${simMode === 'mobile' ? 'text-center' : 'md:w-auto text-left'}`}>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                        Command Overview
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">Real-time intelligence and incident resolution tracking</p>
                </div>

                <div className={`flex flex-wrap gap-4 w-full ${simMode === 'mobile' ? 'justify-center' : 'md:w-auto justify-end'}`}>
                    <button
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 rounded-xl transition-all duration-300 font-medium group shadow-lg shadow-emerald-500/5 whitespace-nowrap"
                    >
                        <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Resolved Incidents</span>
                    </button>
                    
                    <button
                        onClick={handleAutofetch}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 rounded-xl transition-all duration-300 font-medium group disabled:opacity-50 shadow-lg shadow-indigo-500/5 whitespace-nowrap"
                    >
                        {isFetching ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Newspaper size={18} className="group-hover:rotate-12 transition-transform" />
                        )}
                        <span>{isFetching ? 'Fetching News...' : 'News Autofetcher'}</span>
                    </button>
                </div>

                {simMode !== 'mobile' && (
                    <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                        <div className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                            Last Updated: <span className="text-[var(--text-primary)] font-mono">Just now</span>
                        </div>
                    </div>
                )}
            </div>

            <div className={`grid gap-6 mb-8 ${simMode === 'desktop' ? 'grid-cols-5' : simMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <StatCard title="Total Incidents (24h)" value="142" change="+12%" icon={Shield} trend="up" />
                <StatCard title="Resolve Rate" value="84.2%" change="+5.4%" icon={Target} trend="down" />
                <StatCard title="Active High Risk Zones" value="12" change="-2" icon={AlertOctagon} trend="down" />
                <StatCard title="Resolved Incidents" value="128" change="+14" icon={CheckCircle2} trend="up" />
                <StatCard title="Response Time Avg" value="4.2m" change="-1.1m" icon={TrendingUp} trend="down" />
            </div>

            <div className={`grid gap-6 mb-8 ${simMode === 'desktop' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                <div className={`${simMode === 'desktop' ? 'col-span-2' : 'col-span-1'} bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-primary)] p-6 rounded-2xl shadow-xl min-h-[400px]`}>
                    <IncidentChart />
                </div>
                <div className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-primary)] p-6 rounded-2xl shadow-xl min-h-[400px]">
                    <CrimeTypeChart />
                </div>
            </div>

            <div className={`grid gap-6 pb-8 ${simMode === 'desktop' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                <div className={`${simMode === 'desktop' ? 'col-span-2' : 'col-span-1'}`}>
                    <RecentAlerts
                        alerts={alerts}
                        onAlertClick={(alert) => {
                            setSelectedIncident(alert);
                            setIsIncidentModalOpen(true);
                        }}
                    />
                </div>
                <div className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-primary)] p-6 rounded-2xl shadow-xl min-h-[400px] flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 size={24} className="text-emerald-500" />
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recently Resolved</h3>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-2">
                        {[
                            { id: 1, title: 'Medical Emergency', area: 'Downtown', time: '15m ago', color: 'emerald' },
                            { id: 2, title: 'Traffic Obstruction', area: 'Main St', time: '42m ago', color: 'emerald' },
                            { id: 3, title: 'Power Outage', area: 'Suburbs', time: '1h ago', color: 'indigo' },
                            { id: 4, title: 'Water Leak', area: 'Old Town', time: '2h ago', color: 'emerald' }
                        ].map((item) => (
                            <div key={item.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-primary)] flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                                <div>
                                    <h4 className="text-sm font-medium text-[var(--text-primary)]">{item.title}</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">{item.area} • {item.time}</p>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500`}>
                                    Resolved
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 w-full py-2 text-sm font-medium text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/5 transition-colors">
                        View Resolution Archive
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
