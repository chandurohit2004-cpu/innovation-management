import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Theft', value: 45 },
    { name: 'Assault', value: 25 },
    { name: 'Vandalism', value: 20 },
    { name: 'Burglary', value: 10 },
];

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const CrimeTypeChart = () => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Crime Distribution</h3>
                <p className="text-sm text-[var(--text-secondary)]">Breakdown by current active types</p>
            </div>
            <div className="flex-1 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-primary)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CrimeTypeChart;
