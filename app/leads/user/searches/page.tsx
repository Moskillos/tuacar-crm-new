"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserNav } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/hooks/useAppContext';

interface AuthResponse {
    userRoles: string[];
}

interface UserData {
    userId: number;
    name: string;
}

interface SearchData {
    search_id: number;
    user_id: number;
    search_filename: string;
    search_path: string;
    search_options: string;
    search_results: string;
    search_date: string;
    SpokiSchedActive: number;
    results: string;
}

interface SearchOptions {
    [key: string]: {
        platform: string;
        yearFrom: string;
        yearTo: string;
        mileageFrom: string;
        mileageTo: string;
        geoTowns: string[];
    };
}

interface Platform {
    title: string;
    value: string;
}

function UserSearchesContent() {
    const router = useRouter();
    const { agencyEmail }: any = useAppContext();

    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdminCheck, setIsAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

    const [searches, setSearches] = useState<SearchData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const platforms: Platform[] = [
        { title: 'Autoscout', value: 'platform-01' },
        { title: 'Subito', value: 'platform-02' },
        { title: 'Moto.it', value: 'platform-04' },
        { title: 'Moto da Subito', value: 'platform-05' },
        { title: 'Caravan e Camper da Subito', value: 'platform-06' },
        { title: 'Veicoli commerciali sotto i 35q', value: 'platform-07' },
        { title: 'Furgoni su Autoscout', value: 'platform-08' },
    ];

    const getPlatformTitle = (platformValue: string): string => {
        return platforms.find(p => p.value === platformValue)?.title || platformValue;
    };

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
        const fetchUserData = async () => {
            if (!agencyEmail) return;
            try {
                setIsUserLoading(true);
                const response = await fetch(`/api/leads/user/${agencyEmail}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUserData({
                    userId: data.user_id,
                    name: data.user_name
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsUserLoading(false);
            }
        };

        fetchUserData();
    }, [agencyEmail]);

    useEffect(() => {
        const fetchSearches = async () => {
            if (!userData?.userId) return;

            try {
                const response = await fetch(`/api/leads/searches/${userData.userId}`);
                const data = await response.json();
                setSearches(data);
            } catch (error) {
                console.error('Error fetching searches:', error);
            }
        };

        fetchSearches();
    }, [userData]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const parseSearchOptions = (optionsString: string): SearchOptions => {
        try {
            return JSON.parse(optionsString);
        } catch {
            return {};
        }
    };

    const totalPages = Math.ceil(searches.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSearches = searches.slice(startIndex, endIndex);

    const maxVisiblePages = 5;

    const getPaginationRange = () => {
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = start + maxVisiblePages - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFileDownload = async (filename: string, search_path: string) => {
        try {
            const response = await fetch(`/api/leads/scheduled-task/downloads?searchPath=${search_path}&fileName=${filename}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Download failed with status: ${response.status}`);
            }

            // Get the file content as blob
            const blob = await response.blob();

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    if (isLoading) {
        return <div className="bg-[#011529] min-h-screen" />;
    }

    if (isUserLoading) {
        return (
            <div className="bg-[#011529] min-h-screen flex justify-center items-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-semibold mb-2">Caricamento dati utente...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#011529] min-h-screen">
            <div className="py-12 md:py-24 lg:py-32 mx-auto w-3/4">
                <UserNav isAdminCheck={isAdminCheck} />
                <div className="bg-white rounded-xl p-6">
                    <h1 className="text-2xl font-semibold mb-6 text-center">
                        Storico ricerche per {userData?.name || 'Utente'}
                    </h1>

                    {searches.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Nessuna ricerca trovata per questo utente.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-amber-50 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-amber-100">
                                            <th className="px-4 py-2 text-left">Data</th>
                                            <th className="px-4 py-2 text-left">File</th>
                                            <th className="px-4 py-2 text-left">Risultati</th>
                                            <th className="px-4 py-2 text-left">Parametri</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSearches.map((search) => {
                                            const options = parseSearchOptions(search.search_options);

                                            return (
                                                <tr key={search.search_id} className="border-t border-amber-200">
                                                    <td className="px-4 py-4">
                                                        {formatDate(search.search_date)}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <button
                                                            onClick={() => handleFileDownload(search.search_filename, search.search_path)}
                                                            className="text-green-600 hover:text-green-800 flex items-center"
                                                        >
                                                            <Download className="w-5 h-5 mr-1" />
                                                            {search.search_filename}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {search.search_results}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {Object.entries(options).map(([platformKey, platformData]) => (
                                                            <div key={platformKey} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                                                                <div className="font-semibold text-gray-700 mb-2">
                                                                    {getPlatformTitle(platformData.platform)}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <div className="text-gray-600">Anno:</div>
                                                                        <div>da {platformData.yearFrom || 'Qualsiasi'} a {platformData.yearTo || 'Qualsiasi'}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-gray-600">Km:</div>
                                                                        <div>da {platformData.mileageFrom || 'Qualsiasi'} a {platformData.mileageTo || 'Qualsiasi'}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2">
                                                                    <div className="text-gray-600 mb-1">Comuni:</div>
                                                                    <div className="text-sm">
                                                                        {platformData.geoTowns.join(', ')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4 items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${currentPage === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        1
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-2 py-1 rounded ${currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-gray-200'
                                            }`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {getPaginationRange().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded min-w-[2rem] ${currentPage === page
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-2 py-1 rounded ${currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-gray-200'
                                            }`}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${currentPage === totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        {totalPages}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


function LoadingFallback() {
    return (
        <div className="bg-[#011529] min-h-screen flex justify-center items-center">
            <div className="text-white">Caricamento...</div>
        </div>
    );
}

export default function UserSearches() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <UserSearchesContent />
        </Suspense>
    );
} 