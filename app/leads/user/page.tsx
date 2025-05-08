'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { toast } from 'sonner';
import Image from 'next/image';
import { Link } from '@radix-ui/themes';
import { UserNav } from '@/components/ui/tabs';

interface UserData {
    user_id: number;
    user_name: string;
    user_phone: string;
    user_ragione_sociale: string;
    user_address: string;
}

export default function UserProfile() {
    const { agencyEmail }: any = useAppContext();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // Password fields (not functional as requested)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/leads/user/${agencyEmail}`);
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Errore nel caricamento dei dati utente');
            } finally {
                setLoading(false);
            }
        };

        if (agencyEmail) {
            fetchUserData();
        }
    }, [agencyEmail]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (userData) {
            setUserData({
                ...userData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) return;

        try {
            const response = await fetch('/api/leads/users/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                toast.success('Profilo aggiornato con successo');
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Errore durante l\'aggiornamento del profilo');
        }
    };

    const handlePasswordUpdate = async () => {
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            toast.error('Le password non coincidono');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            toast.error('La password deve essere di almeno 6 caratteri');
            return;
        }

        try {
            const response = await fetch('/api/leads/users/updatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMail: agencyEmail,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmNewPassword: confirmPassword
                }),
            });

            if (response.ok) {
                toast.success('Password aggiornata con successo');
                // Clear password fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                throw new Error('Password update failed');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Errore durante l\'aggiornamento della password');
        }
    };

    if (loading) {
        return <div className="bg-[#011529] min-h-screen" />;
    }

    return (
        <>
            <div className="bg-[#011529] min-h-screen">
                <div className="py-12 md:py-24 lg:py-32 mx-auto w-3/4">
                    <UserNav />
                    <div className="bg-white rounded-xl p-6">
                        <div className="grid grid-cols-2 gap-8">
                            {/* Profile Section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Profilo utente</h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1">
                                            Nome Cognome
                                        </label>
                                        <input
                                            type="text"
                                            name="user_name"
                                            value={userData?.user_name || ''}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            Ragione Sociale
                                        </label>
                                        <input
                                            type="text"
                                            name="user_ragione_sociale"
                                            value={userData?.user_ragione_sociale || ''}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            Telefono
                                        </label>
                                        <input
                                            type="text"
                                            name="user_phone"
                                            value={userData?.user_phone || ''}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            Indirizzo
                                        </label>
                                        <input
                                            type="text"
                                            name="user_address"
                                            value={userData?.user_address || ''}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md p-2"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Salva profilo
                                    </button>
                                </form>
                            </div>

                            {/* Password Section */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Modifica password</h2>
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="block mb-1">
                                            <span className="text-red-500">*</span> Password attuale
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full border rounded-md p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            <span className="text-red-500">*</span> Nuova password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full border rounded-md p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            <span className="text-red-500">*</span> Conferma nuova password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full border rounded-md p-2"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handlePasswordUpdate}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Modifica password
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 