"use client"

import React from 'react';
import { User, FileText, Map, X, Star, StarOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { UserNav } from '@/components/ui/tabs';

interface UserData {
    id: number;
    user_id: number;
    name: string;
    company: string;
    vat_number: string;
    ssn_number: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    region: string;
    location: number;
    phone: string;
    user_config: string;
    spoki_api: string;
    IsSpokiEnabled: number;
    Secret: string;
    uuID: string;
    email: string;
    status: number;
    verified: number;
    roles_mask: number;
    isNewAgency: number;
}

interface AuthResponse {
    userRoles: string[];
}

interface SpokiModalProps {
    user: UserData | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: UserData) => void;
}

interface AgencyStatusModalProps {
    user: UserData | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: UserData) => void;
}

const SpokiModal = ({ user, isOpen, onClose, onUpdate }: SpokiModalProps) => {
    const [spokiData, setSpokiData] = useState({
        spoki_api: '',
        Secret: '',
        uuID: '',
        IsSpokiEnabled: false
    });

    useEffect(() => {
        if (user) {
            setSpokiData({
                spoki_api: user.spoki_api || '',
                Secret: user.Secret || '',
                uuID: user.uuID || '',
                IsSpokiEnabled: user.IsSpokiEnabled === 1
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser = {
                ...user,
                spoki_api: spokiData.spoki_api,
                Secret: spokiData.Secret,
                uuID: spokiData.uuID,
                IsSpokiEnabled: spokiData.IsSpokiEnabled ? 1 : 0
            };
            
            const response = await fetch('/api/leads/user/updateSpoki', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });


            if (!response.ok) {
                throw new Error('Update failed');
            }
            
            // Call the onUpdate callback with the updated user
            onUpdate(updatedUser);
            toast.success('Impostazioni Spoki aggiornate con successo');
        } catch (error) {
            console.error('Error updating Spoki settings:', error);
            toast.error('Errore durante l\'aggiornamento delle impostazioni Spoki');
        } finally {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Modifica dati Spoki per l'utente</h2>
                    <button onClick={onClose} className="p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">
                            <span className="text-red-500">*</span> spokiApiKey
                        </label>
                        <input
                            type="text"
                            value={spokiData.spoki_api}
                            onChange={(e) => setSpokiData(prev => ({ ...prev, spoki_api: e.target.value }))}
                            className="w-full border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">
                            <span className="text-red-500">*</span> spokiServiceKey
                        </label>
                        <input
                            type="text"
                            value={spokiData.Secret}
                            onChange={(e) => setSpokiData(prev => ({ ...prev, Secret: e.target.value }))}
                            className="w-full border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">
                            <span className="text-red-500">*</span> link uuID
                        </label>
                        <input
                            type="text"
                            value={spokiData.uuID}
                            onChange={(e) => setSpokiData(prev => ({ ...prev, uuID: e.target.value }))}
                            className="w-full border rounded-md p-2"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="spokiEnabled"
                            checked={spokiData.IsSpokiEnabled}
                            onChange={(e) => setSpokiData(prev => ({ ...prev, IsSpokiEnabled: e.target.checked }))}
                            className="rounded"
                        />
                        <label htmlFor="spokiEnabled">
                            Abilita / Disabilita Spoki per questo utente
                        </label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Chiudi
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Salva modifiche
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function UserEditModal({ user, isOpen, onClose, onSave }: {
    user: UserData | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: UserData) => void;
}) {
    const [formData, setFormData] = useState<UserData | null>(null);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    if (!isOpen || !formData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            const response = await fetch('/api/leads/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Profilo aggiornato con successo');
                onSave(formData);
                onClose();
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Errore durante l\'aggiornamento del profilo');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Modifica utente</h2>
                    <button onClick={onClose} className="p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-bold">
                                <span className="text-red-500">*</span> Status utente
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                required
                            >
                                <option value="0">Account attivo</option>
                                <option value="2">Account bannato</option>
                                <option value="4">Attesa revisione</option>
                                <option value="5">Account sospeso</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-bold">
                                <span className="text-red-500">*</span> Ruolo utente
                            </label>
                            <select
                                name="roles_mask"
                                value={formData.roles_mask}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                required
                            >
                                <option value="16">Utente normale</option>
                                <option value="1">Amministratore</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-bold">
                            <span className="text-red-500">*</span> Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-bold">
                            <span className="text-red-500">*</span> Nome Cognome
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-bold">
                            <span className="text-red-500">*</span> Ragione Sociale
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-bold">P.Iva</label>
                            <input
                                type="text"
                                name="vat_number"
                                value={formData.vat_number}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">Codice Fiscale</label>
                            <input
                                type="text"
                                name="ssn_number"
                                value={formData.ssn_number}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-bold">Telefono</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-bold">
                            <span className="text-red-500">*</span> Indirizzo
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-bold">
                                <span className="text-red-500">*</span> CAP
                            </label>
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">
                                <span className="text-red-500">*</span> Località
                            </label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                required
                            >
                                <option value="">Seleziona</option>
                                <option value={formData.city}>{formData.city}</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Elimina
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Salva modifiche
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function AgencyStatusModal({ user, isOpen, onClose, onUpdate }: AgencyStatusModalProps) {
    if (!isOpen || !user) return null;

    const handleUpdateStatus = async () => {
        try {
            const response = await fetch('/api/leads/user/updateAgencyStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.user_id,
                    isNewAgency: user.isNewAgency === 1 ? 0 : 1
                }),
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            const updatedUser = { ...user, isNewAgency: user.isNewAgency === 1 ? 0 : 1 };
            onUpdate(updatedUser);
            toast.success('Stato agenzia aggiornato con successo');
            onClose();
        } catch (error) {
            console.error('Error updating agency status:', error);
            toast.error('Errore durante l\'aggiornamento dello stato agenzia');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Modifica stato agenzia</h2>
                    <button onClick={onClose} className="p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4">
                    <p>Stato attuale: {user.isNewAgency === 1 ? 'Nuova Agenzia' : 'Agenzia Esistente'}</p>
                    <p className="text-sm text-gray-600 mt-2">
                        Vuoi cambiare lo stato dell'agenzia?
                    </p>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleUpdateStatus}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Conferma
                    </button>
                </div>
            </div>
        </div>
    );
};

function UserList() {
    const [isAdminCheck, setIsAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<UserData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSpokiModalOpen, setIsSpokiModalOpen] = useState(false);
    const [isAgencyStatusModalOpen, setIsAgencyStatusModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const itemsPerPage = 5;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/session');
                const data: AuthResponse = await response.json();
                setIsAdmin(data.userRoles[0].split('|')[1] === 'admin');
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/leads/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        console.log('isAdminCheck:', isAdminCheck);
        console.log('isLoading:', isLoading);
        if (isAdminCheck && !isLoading) fetchUsers();
        console.log('users:', users);
    }, [setIsAdmin, isLoading]);

    const handleUserEdit = (user: UserData) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleUserUpdate = (updatedUser: UserData) => {
        setUsers(users.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
    };

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.company.toLowerCase().includes(query) ||
            user.city.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const getUserType = (rolesMask: number) => rolesMask === 1 ? 'Admin' : 'User';
    const getAccountStatus = (status: number) => status === 1 ? 'attivo' : 'disattivato';

    if (isLoading) {
        return <div className="bg-[#011529] min-h-screen" />;
    }

    if (!isAdminCheck) {
        return (
            <div className="bg-[#011529] min-h-screen flex justify-center items-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-semibold mb-2">Accesso Negato</h1>
                    <p>Non hai i permessi necessari per visualizzare questa pagina.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#011529] min-h-screen">
            <Toaster />
            <div className="py-12 md:py-24 lg:py-32 mx-auto w-3/4">
                <UserNav isAdminCheck={isAdminCheck} />
                <div className="bg-white rounded-xl p-6">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Elenco utenti</h1>

                    {/* Search bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cerca per nome, email, azienda o città..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>
                        {searchQuery && (
                            <div className="mt-2 text-sm text-gray-600">
                                Trovati {filteredUsers.length} utenti per "{searchQuery}"
                            </div>
                        )}
                    </div>

                    <div className="bg-amber-50 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-100">
                                    <th className="px-4 py-2 text-left">Login</th>
                                    <th className="px-4 py-2 text-left">Dati Utente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.id} className="border-t border-amber-200">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleUserEdit(user)} className="cursor-pointer">
                                                        <User className="w-5 h-5 text-blue-500" />
                                                    </button>
                                                    <a href={`/leads/admin/searches?user_id=${user.user_id}&name=${encodeURIComponent(user.name)}`}>
                                                        <FileText className="w-5 h-5 text-green-500 cursor-pointer" />
                                                    </a>
                                                    <a href={`/leads/admin/localities?user_id=${user.user_id}&name=${encodeURIComponent(user.name)}`}>
                                                        <Map className="w-5 h-5 text-yellow-500 cursor-pointer" />
                                                    </a>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setIsAgencyStatusModalOpen(true);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        {user.isNewAgency === 1 ? (
                                                            <span className="text-green-500 underline">Nuova Agenzia</span>
                                                        ) : (
                                                            <span className="text-gray-500 underline">Agenzia Esistente</span>
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="mt-2">
                                                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                                                        {user.email}
                                                    </a>
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    ({getUserType(user.roles_mask)} / Account {getAccountStatus(user.status)})
                                                </div>
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setIsSpokiModalOpen(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="w-5 h-5 inline">
                                                            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium">
                                                    {user.name} ({user.company} / {user.vat_number})
                                                </div>
                                                <div className="mt-2">
                                                    {user.address}
                                                </div>
                                                <div>
                                                    {user.zip}-{user.city} ({user.state}), {user.region}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-4 text-center text-gray-500">
                                            {searchQuery ?
                                                "Nessun utente trovato con i criteri di ricerca specificati." :
                                                "Nessun utente disponibile."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length > 0 && (
                        <div className="flex justify-center mt-4 gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded ${currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <UserEditModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleUserUpdate}
                />
                <SpokiModal
                    user={selectedUser}
                    isOpen={isSpokiModalOpen}
                    onClose={() => {
                        setIsSpokiModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onUpdate={handleUserUpdate}
                />
                <AgencyStatusModal
                    user={selectedUser}
                    isOpen={isAgencyStatusModalOpen}
                    onClose={() => {
                        setIsAgencyStatusModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onUpdate={handleUserUpdate}
                />
            </div>
        </div>
    );
};

export default UserList;