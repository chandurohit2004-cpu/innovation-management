import { AlertTriangle, MapPin, Clock } from 'lucide-react';

export const initialAlerts = [
    {
        id: 1,
        type: 'High',
        severity: 'High' as const,
        title: 'Armed Robbery',
        location: 'Downtown 4th Ave',
        time: '5m ago',
        description: 'A commercial robbery was reported. Suspects were armed and fled the scene in a dark sedan. Units are currently canvassing the area.'
    },
    {
        id: 2,
        type: 'Moderate',
        severity: 'Moderate' as const,
        title: 'Suspicious Activity',
        location: 'Westside Park',
        time: '12m ago',
        description: 'Reports of individuals loitering near the park entrance after hours. No immediate threat, but surveillance has been increased.'
    },
    {
        id: 3,
        type: 'Low',
        severity: 'Low' as const,
        title: 'Noise Complaint',
        location: 'Residential District B',
        time: '1h ago',
        description: 'Loud music reported in the area. Local unit addressed the issue and the situation is now resolved.'
    },
    {
        id: 4,
        type: 'High',
        severity: 'High' as const,
        title: 'Assault Reported',
        location: 'Subway Station North',
        time: '2h ago',
        description: 'Verbal altercation escalated into a physical assault. One suspect in custody, medical assistance provided to the victim.'
    },
];

interface RecentAlertsProps {
    onAlertClick?: (alert: any) => void;
    alerts?: typeof initialAlerts;
}

const RecentAlerts = ({ onAlertClick, alerts = initialAlerts }: RecentAlertsProps) => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Live Incident Feed</h3>
                <p className="text-sm text-[var(--text-secondary)]">Real-time alerts from dispatched units</p>
            </div>
            <div className="flex-1 w-full overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        onClick={() => onAlertClick?.(alert)}
                        className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-[var(--border-primary)] hover:border-blue-500/30 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle
                                    size={16}
                                    className={
                                        alert.type === 'High' ? 'text-danger' :
                                            alert.type === 'Moderate' ? 'text-amber-500' : 'text-blue-500'
                                    }
                                />
                                <span className="font-medium text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">{alert.title}</span>
                            </div>
                            <span className={
                                `text-xs px-2 py-0.5 rounded-full border ${alert.type === 'High' ? 'bg-danger/10 text-danger border-danger/20' :
                                    alert.type === 'Moderate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`
                            }>
                                {alert.type}
                            </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-y-2 text-xs text-[var(--text-secondary)]">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {alert.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {alert.time}
                                </div>
                            </div>
                            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-blue-500">View Details</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentAlerts;
