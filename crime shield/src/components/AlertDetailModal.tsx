import { X, MapPin, Clock, AlertTriangle, ShieldCheck, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    alert: {
        type: string;
        title: string;
        location: string;
        time: string;
        description: string;
        severity: 'High' | 'Moderate' | 'Low';
    } | null;
}

const AlertDetailModal = ({ isOpen, onClose, alert }: AlertDetailModalProps) => {
    if (!isOpen || !alert) return null;

    const severityColor =
        alert.severity === 'High' ? 'text-danger' :
            alert.severity === 'Moderate' ? 'text-amber-500' : 'text-blue-500';

    const severityBg =
        alert.severity === 'High' ? 'bg-danger/10 border-danger/20' :
            alert.severity === 'Moderate' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center bg-black/5 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${severityBg} ${severityColor}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">Incident Details</h2>
                            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Reference ID: #CR-{Math.floor(Math.random() * 9000) + 1000}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{alert.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${severityBg} ${severityColor}`}>
                                {alert.severity} Risk
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <div className="p-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--border-primary)]">
                                    <MapPin size={16} />
                                </div>
                                {alert.location}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                <div className="p-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--border-primary)]">
                                    <Clock size={16} />
                                </div>
                                {alert.time}
                            </div>
                        </div>

                        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-primary)]">
                            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">AI Analysis & Status</h4>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                                {alert.description}
                            </p>
                        </div>
                    </div>

                    {/* Dispatch Progress (Visual Element) */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                            <span>Unit Dispatch</span>
                            <span className="text-blue-500">In Progress</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-blue-500 rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-primary)] bg-black/5 dark:bg-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-[var(--bg-primary)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)] rounded-xl font-medium transition-colors border border-[var(--border-primary)] flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={18} />
                        Acknowledge
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            window.location.href = '/routes';
                        }}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        <Navigation size={18} />
                        Plan Safe Route
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AlertDetailModal;
