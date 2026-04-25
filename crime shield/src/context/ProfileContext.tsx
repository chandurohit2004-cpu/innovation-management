import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Profile {
    name: string;
    email: string;
    mobile: string;
    appId: string;
    level: string;
    avatar: string;
    avatarUrl?: string;
}

interface ProfileContextType {
    profile: Profile;
    updateProfile: (newProfile: Partial<Profile>) => void;
    isLoading: boolean;
}

const defaultProfile: Profile = {
    name: 'Cheruku Venkata Reddy',
    email: 'bobbyreddycheruku9189@gmail.com',
    mobile: '6300581785',
    appId: 'TIVAS-4582-X-99',
    level: 'Admin Level 4',
    avatar: 'CR',
    avatarUrl: '',
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<Profile>(() => {
        const saved = localStorage.getItem('tivas_profile');
        return saved ? JSON.parse(saved) : defaultProfile;
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch profile from Firestore on mount
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                // Using a generic 'user_profile' document for this demo
                const docRef = doc(db, "users", "cheruku-venkata-reddy");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile(docSnap.data() as Profile);
                }
            } catch (error) {
                console.warn("Cloud sync failed, using local storage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Sync to local storage
    useEffect(() => {
        localStorage.setItem('tivas_profile', JSON.stringify(profile));
    }, [profile]);

    const updateProfile = async (newProfile: Partial<Profile>) => {
        const updated = { ...profile, ...newProfile };
        setProfile(updated);

        // Sync to Firestore
        try {
            await setDoc(doc(db, "users", "cheruku-venkata-reddy"), updated);
        } catch (error) {
            console.error("Failed to sync to cloud:", error);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
