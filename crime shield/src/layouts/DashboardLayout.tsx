import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Map, Route, BellRing, ShieldAlert, X, ChevronDown, User, Mail, Hash, LogOut, Sun, Moon, ArrowRight, Monitor, Tablet, Smartphone, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import SettingsModal from '../components/SettingsModal';
import AlertDetailModal from '../components/AlertDetailModal';

const staticAlerts = [
    {
        id: 1,
        type: 'High',
        severity: 'High' as const,
        title: 'High Risk: Downtown',
        location: 'Downtown Transit Hub',
        time: '5m ago',
        description: 'System detects high-probability opportunistic theft and armed suspects near the transit entrance. Dispatched units are en-route. High vigilance recommended.'
    },
    {
        id: 2,
        type: 'Moderate',
        severity: 'Moderate' as const,
        title: 'Moderate: East End',
        location: 'East Industrial Park',
        time: 'Just now',
        description: 'Suspicious vehicle activity reported near warehouse sector B. Local sensors indicate unusual movement patterns at illegal hours.'
    },
];

const DashboardLayout = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<any>(null);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    
    // UI Simulator State
    const [simMode, setSimMode] = useState<'desktop' | 'tablet' | 'mobile'>(
        typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : typeof window !== 'undefined' && window.innerWidth < 1024 ? 'tablet' : 'desktop'
    );
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    
    useEffect(() => {
        let prevBreakpoint = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';

        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            
            const currentBreakpoint = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
            if (currentBreakpoint !== prevBreakpoint) {
                setSimMode(currentBreakpoint as 'desktop' | 'tablet' | 'mobile');
                prevBreakpoint = currentBreakpoint;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { profile } = useProfile();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // Simulate incoming real-time alert
        const timer = setTimeout(() => {
            setShowAlert(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Crime Map', path: '/map', icon: Map },
        { name: 'Safe Routes', path: '/routes', icon: Route },
    ];

    return (
        <div className="min-h-[100dvh] bg-black/90 flex items-center justify-center p-0 md:p-8">
            <div className={`
                flex h-full min-h-[100dvh] md:min-h-0 bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden transition-all duration-500 ease-in-out
                ${simMode === 'desktop' || windowWidth < 1024 ? 'w-full h-[100dvh] rounded-none' : ''}
                ${simMode === 'tablet' && windowWidth >= 1024 ? 'w-full max-w-[850px] h-[95vh] rounded-[2rem] shadow-2xl border-4 border-[#2a2a2a] ring-1 ring-white/10' : ''}
                ${simMode === 'mobile' && windowWidth >= 1024 ? 'w-full max-w-[400px] h-[850px] rounded-[3rem] shadow-2xl border-[12px] border-[#1a1a1a] ring-1 ring-white/10' : ''}
            `}>
                {simMode === 'tablet' || simMode === 'desktop' ? (
                <aside className={`bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col transition-all duration-300 ${simMode === 'tablet' ? 'w-20' : 'w-64'}`}>
                    <div className="py-6 px-4 flex flex-col items-center justify-center border-b border-[var(--border-primary)] text-center h-[88px]">
                        {simMode === 'desktop' ? (
                            <img src={logo} alt="Tivas Branding" className="w-full h-auto max-w-[160px] drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] transform transition-transform duration-500 hover:scale-110" />
                        ) : (
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">T</div>
                        )}
                    </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={item.name}
                            className={({ isActive }) =>
                                `flex items-center ${simMode === 'tablet' ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                }`
                            }
                        >
                            <item.icon size={20} className={simMode === 'tablet' ? '' : 'shrink-0'} />
                            {simMode === 'desktop' && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Active Alerts Widget */}
                {simMode === 'desktop' && (
                    <div className="p-4 mx-4 mb-4 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-primary)]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                                <BellRing size={16} className="text-amber-500" />
                                Active Alerts
                            </h3>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                        </div>
                        <div className="space-y-2">
                            {staticAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    onClick={() => {
                                        setSelectedAlert(alert);
                                        setIsAlertModalOpen(true);
                                    }}
                                    className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 group/alert ${alert.severity === 'High'
                                        ? 'bg-danger/5 border-danger/10 hover:bg-danger/10 hover:border-danger/30'
                                        : 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className={`text-xs font-medium ${alert.severity === 'High' ? 'text-danger' : 'text-amber-500'}`}>
                                            {alert.title}
                                        </p>
                                        <ArrowRight size={10} className="opacity-0 group-hover/alert:opacity-100 transition-opacity translate-x-1" />
                                    </div>
                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">{alert.time} • Click for details</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>
            ) : null}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative w-full">
                
                {/* Device Simulator Header - Only visible on real desktop screens (md:flex) */}
                <div className="hidden md:flex bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] p-2 justify-center gap-2 z-50 absolute top-0 left-0 right-0">
                    <button onClick={() => setSimMode('desktop')} className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${simMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}>
                        <Monitor size={16} /> Desktop Mode
                    </button>
                    <button onClick={() => setSimMode('tablet')} className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${simMode === 'tablet' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}>
                        <Tablet size={16} /> Tablet Mode
                    </button>
                    <button onClick={() => setSimMode('mobile')} className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${simMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}>
                        <Smartphone size={16} /> Mobile Mode
                    </button>
                </div>

                {/* Top Header */}
                <header className={`flex items-center justify-between bg-[var(--bg-secondary)] backdrop-blur-md border-b border-[var(--border-primary)] z-40 w-full relative ${simMode === 'mobile' ? 'px-4 h-14' : 'px-8 h-16'} md:mt-[41px]`}>
                    <div className="flex items-center gap-4">
                        {simMode === 'mobile' ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-1 -ml-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    <MoreVertical size={24} />
                                </button>
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">T</div>
                            </div>
                        ) : (
                            <div className="bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full border border-[var(--border-primary)] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                <span className="text-xs font-medium text-[var(--text-secondary)]">System Online</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 relative">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 border border-transparent hover:border-[var(--border-primary)]"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {simMode !== 'mobile' && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-[var(--text-primary)]">{profile.name}</p>
                                <p className="text-xs text-[var(--text-secondary)]">Command Center</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-1 sm:gap-3 p-1 pr-1 sm:pr-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-[var(--border-primary)]"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.1)] overflow-hidden">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    profile.avatar
                                )}
                            </div>
                            <ChevronDown size={16} className={`text-[var(--text-secondary)] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Profile Dropdown */}
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-14 right-0 z-50 w-72 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden"
                                >
                                    <div className="p-5 border-b border-[var(--border-primary)] bg-black/5 dark:bg-white/5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden">
                                                {profile.avatarUrl ? (
                                                    <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    profile.avatar
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--text-primary)]">{profile.name}</h4>
                                                <p className="text-xs text-blue-500 font-medium px-2 py-0.5 bg-blue-500/10 rounded-full inline-block mt-1">{profile.level}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                                                <div className="p-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--border-primary)]">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="text-xs truncate">{profile.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                                                <div className="p-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--border-primary)]">
                                                    <Hash size={14} />
                                                </div>
                                                <span className="text-xs">{profile.appId}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setIsSettingsOpen(true);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                                        >
                                            <User size={18} />
                                            Account Settings
                                        </button>
                                        <div className="h-px bg-[var(--border-primary)] my-1 mx-2"></div>
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                alert('Logging out...');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Mobile Navigation Dropdown */}
                <AnimatePresence>
                    {simMode === 'mobile' && isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }}
                            className="absolute top-[60px] left-4 z-50 w-64 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden md:hidden"
                        >
                            <nav className="p-2 space-y-1">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-blue-600/10 text-blue-500 font-medium border border-blue-500/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                            }`
                                        }
                                    >
                                        <item.icon size={20} className="shrink-0" />
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                <AlertDetailModal
                    isOpen={isAlertModalOpen}
                    onClose={() => setIsAlertModalOpen(false)}
                    alert={selectedAlert}
                />

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-[var(--bg-primary)] h-full relative">
                    <Outlet context={{ simMode }} />
                </div>

                {/* Global Real-time Alert Toast */}
                <AnimatePresence>
                    {showAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="absolute top-20 right-8 z-50 max-w-sm"
                        >
                            <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-danger/50 p-4 rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.2)]">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-danger/10 rounded-full text-danger shrink-0 mt-1">
                                        <ShieldAlert size={24} className="animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-[var(--text-primary)]">CRITICAL ALERT</h4>
                                            <button onClick={() => setShowAlert(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] font-medium mb-2">Armed suspect reported near Transit Hub.</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase tracking-wider bg-danger/20 text-danger px-2 py-0.5 rounded font-bold">Dispatch Recommended</span>
                                            <span className="text-xs text-[var(--text-secondary)]">Just now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Removed bottom nav */}
            </main>
            </div>
        </div>
    );
};
export default DashboardLayout;
