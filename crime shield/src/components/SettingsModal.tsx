import React, { useState, useRef } from 'react';
import { X, User, Mail, Phone, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { profile, updateProfile } = useProfile();
    const [formData, setFormData] = useState({ ...profile });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatarUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API call for cloud sync
        await new Promise(resolve => setTimeout(resolve, 1500));

        updateProfile(formData);
        setIsSaving(false);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-[95%] sm:w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center bg-black/5 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Account Settings</h2>
                                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Update your profile information</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl group-hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden">
                                        {formData.avatarUrl ? (
                                            <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            formData.avatar
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    {formData.avatarUrl ? (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                                            className="text-[10px] text-danger uppercase tracking-wider font-bold hover:underline"
                                        >
                                            Remove Photo
                                        </button>
                                    ) : (
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tighter">Click to upload photo</p>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="text"
                                            className="text-center bg-black/5 dark:bg-white/5 border border-[var(--border-primary)] rounded-lg text-blue-500 font-bold w-12 py-1 focus:ring-0 text-sm"
                                            value={formData.avatar}
                                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value.substring(0, 2).toUpperCase() })}
                                            maxLength={2}
                                            title="Edit Initials"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Initials</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-primary)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-primary)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-primary)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] rounded-xl font-medium transition-colors border border-[var(--border-primary)]"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : showSuccess ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Updated!
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
