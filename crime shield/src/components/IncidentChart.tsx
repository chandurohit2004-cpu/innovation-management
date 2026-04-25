import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '00:00', incidents: 12, resolved: 8 },
    { time: '04:00', incidents: 8, resolved: 6 },
    { time: '08:00', incidents: 25, resolved: 18 },
    { time: '12:00', incidents: 42, resolved: 32 },
    { time: '16:00', incidents: 38, resolved: 30 },
    { time: '20:00', incidents: 45, resolved: 38 },
    { time: '24:00', incidents: 10, resolved: 9 },
];

const IncidentChart = () => {
    return (
        <div className="h-full w-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Incident Trends (24h)</h3>
                <p className="text-sm text-[var(--text-secondary)]">Reported vs Resolved incidents</p>
            </div>
            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                        <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-primary)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Area type="monotone" dataKey="incidents" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" name="Reported" />
                        <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncidentChart;
