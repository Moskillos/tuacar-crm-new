import { Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TabProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
}

interface TabsData {
    comuni: string[];
    email?: string;
    isAdmin?: boolean;
}

interface FormData {
    yearFrom: string;
    yearTo: string;
    mileageFrom: string;
    mileageTo: string;
    isSearchActive: boolean;
    startTime: string;
    repeatInterval: string;
    isSpokiActive: boolean;
    selectedPlatforms: string[];
}

interface SearchContentItem {
    platform: string;
    yearFrom: string;
    yearTo: string;
    mileageFrom: string;
    mileageTo: string;
    geoTowns: any;
}

interface AuthResponse {
    userRoles: string[];
}

interface UserNavProps {
    isAdminCheck?: boolean;
}

interface ScheduledTask {
    task_id: number;
    schedule_start: string;
    schedule_repeat_h: number;
    schedule_content: string;
}

interface ProvinceItem {
    sigla: string;
    denominazione: string;
}

export function UserNav({ isAdminCheck }: UserNavProps) {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

        if (isAdminCheck === undefined) checkAuth();
        else {
            setIsAdmin(isAdminCheck);
            setIsLoading(false);
        }
    }, []);

    if (isLoading) return null;

    return (
        <div className="shadow-md rounded-2xl my-2 overflow-hidden bg-white">
            <nav className="max-w-7xl mx-auto px-4">
                <ul className="flex space-x-8">
                    <li>
                        <Link
                            href="/leads/research"
                            className={`inline-block py-4 border-b-2 ${pathname === '/leads/research'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            Ricerca Leads
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/leads/user"
                            className={`inline-block py-4 border-b-2 ${pathname === '/leads/user'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            Profilo Utente
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/leads/user/searches"
                            className={`inline-block py-4 border-b-2 ${pathname === '/leads/user/searches'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            Le Mie Ricerche
                        </Link>
                    </li>
                    {isAdmin && (
                        <>
                            <li>
                                <Link
                                    href="/leads/admin/users"
                                    className={`inline-block py-4 border-b-2 ${pathname === '/leads/admin/users'
                                        ? 'border-blue-500 text-blue-500'
                                        : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    Gestione Utenti
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default function PlatformSearch({ comuni, email, isAdmin }: TabsData) {
    const platforms: TabProps[] = [
        { title: 'Autoscout', value: 'platform-01' },
        { title: 'Subito', value: 'platform-02' },
        { title: 'Moto.it', value: 'platform-04' },
        { title: 'Moto da Subito', value: 'platform-05' },
        { title: 'Caravan e Camper da Subito', value: 'platform-06' },
        { title: 'Veicoli commerciali sotto i 35q', value: 'platform-07' },
        { title: 'Furgoni su Autoscout', value: 'platform-08' },
    ];

    const [isLoading, setIsLoading] = useState({
        immediate: false,
        scheduled: false,
        regions: false,
        provinces: false
    });

    const [formData, setFormData] = useState<FormData>({
        yearFrom: '',
        yearTo: '',
        mileageFrom: '',
        mileageTo: '',
        isSearchActive: true,
        startTime: '',
        repeatInterval: '',
        isSpokiActive: false,
        selectedPlatforms: []
    });

    const [useCustomRegions, setUseCustomRegions] = useState(false);
    const [regions, setRegions] = useState<string[]>([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<ProvinceItem | null>(null);
    const [availableComuni, setAvailableComuni] = useState<string[]>([]);
    const [selectedComuni, setSelectedComuni] = useState<string[]>([]);
    const [isLoadingComuni, setIsLoadingComuni] = useState(false);

    const [scheduledTask, setScheduledTask] = useState<ScheduledTask | null>(null);
    const [isLoadingTask, setIsLoadingTask] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (name === 'isSearchActive' || name === 'isSpokiActive') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        }
    };

    const handlePlatformToggle = (platformValue: string) => {
        setFormData(prev => {
            const updatedPlatforms = prev.selectedPlatforms.includes(platformValue)
                ? prev.selectedPlatforms.filter(p => p !== platformValue)
                : [...prev.selectedPlatforms, platformValue];

            return {
                ...prev,
                selectedPlatforms: updatedPlatforms
            };
        });
    };

    const handleImmediateSearch = async () => {
        if (formData.selectedPlatforms.length === 0) {
            toast.error('Seleziona almeno una piattaforma');
            return;
        }

        if (useCustomRegions && selectedComuni.length === 0) {
            toast.error('Seleziona almeno un comune');
            return;
        }

        setIsLoading(prev => ({ ...prev, immediate: true }));

        const searchContent = formData.selectedPlatforms.reduce<Record<string, SearchContentItem>>((acc, platform) => {
            acc[platform] = {
                platform,
                yearFrom: formData.yearFrom,
                yearTo: formData.yearTo,
                mileageFrom: formData.mileageFrom,
                mileageTo: formData.mileageTo,
                geoTowns: useCustomRegions ? selectedComuni : comuni
            };
            return acc;
        }, {});

        try {
            const response = await fetch("/api/leads/manual-search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userMail: email,
                    search_content: searchContent
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const { results } = await response.json();

            toast.success("Ricerca Effettuata con successo", { description: results.message });
        } catch (error) {
            toast.error("Errore nell'invio della ricerca");
        } finally {
            setIsLoading(prev => ({ ...prev, immediate: false }));
        }
    };

    const handleScheduledSearch = async () => {
        if (formData.selectedPlatforms.length === 0 || !formData.startTime || !formData.repeatInterval) {
            toast.error('Compila tutti i campi richiesti');
            return;
        }

        if (useCustomRegions && selectedComuni.length === 0) {
            toast.error('Seleziona almeno un comune');
            return;
        }

        setIsLoading(prev => ({ ...prev, scheduled: true }));

        const searchContent = formData.selectedPlatforms.reduce<Record<string, SearchContentItem>>((acc, platform) => {
            acc[platform] = {
                platform,
                yearFrom: formData.yearFrom,
                yearTo: formData.yearTo,
                mileageFrom: formData.mileageFrom,
                mileageTo: formData.mileageTo,
                geoTowns: useCustomRegions ? selectedComuni : comuni
            };
            return acc;
        }, {});

        try {
            const response = await fetch("/api/leads/scheduled-search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    search_content: {
                        schedule_start: formData.startTime,
                        schedule_repeat_h: formData.repeatInterval,
                        schedule_cc: "utente.cc@esempio.com",
                        schedule_content: searchContent
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseTask = await fetch(`/api/leads/scheduled-task?email=${email}`);
            const dataTask = await responseTask.json();

            if (dataTask.result) {
                setScheduledTask({
                    task_id: dataTask.result.task_id,
                    schedule_start: dataTask.result.schedule_start,
                    schedule_repeat_h: dataTask.result.schedule_repeat_h,
                    schedule_content: dataTask.result.schedule_content
                });
            }

            toast.success("Ricerca programmata con successo");
        } catch (error) {
            toast.error("Errore nell'invio della ricerca");
        } finally {
            setIsLoading(prev => ({ ...prev, scheduled: false }));
        }
    };

    useEffect(() => {
        const fetchScheduledTask = async () => {
            if (!email) return;

            try {
                const response = await fetch(`/api/leads/scheduled-task?email=${email}`);
                const data = await response.json();

                if (data.result) {
                    setScheduledTask({
                        task_id: data.result.task_id,
                        schedule_start: data.result.schedule_start,
                        schedule_repeat_h: data.result.schedule_repeat_h,
                        schedule_content: data.result.schedule_content
                    });
                }
            } catch (error) {
                console.error('Error fetching scheduled task:', error);
            } finally {
                setIsLoadingTask(false);
            }
        };

        fetchScheduledTask();
    }, [email]);

    useEffect(() => {
        if (isAdmin && useCustomRegions) {
            fetchRegions();
        }
    }, [isAdmin, useCustomRegions]);

    useEffect(() => {
        if (selectedRegion) {
            fetchProvinces(selectedRegion);
        } else {
            setProvinces([]);
            setSelectedProvince(null);
            setSelectedComuni([]);
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince) {
            fetchComuni(selectedProvince.sigla);
        } else {
            setAvailableComuni([]);
            setSelectedComuni([]);
        }
    }, [selectedProvince]);

    const fetchRegions = async () => {
        setIsLoading(prev => ({ ...prev, regions: true }));
        try {
            const response = await fetch('/api/leads/location/regioni');
            const data = await response.json();
            if (data.regionList) {
                setRegions(data.regionList);
            }
        } catch (error) {
            console.error('Error fetching regions:', error);
            toast.error('Errore nel caricamento delle regioni');
        } finally {
            setIsLoading(prev => ({ ...prev, regions: false }));
        }
    };

    const fetchProvinces = async (region: string) => {
        if (!region) return;

        setIsLoading(prev => ({ ...prev, provinces: true }));
        try {
            const response = await fetch(`/api/leads/location/province?regione=${encodeURIComponent(region)}`);
            const data = await response.json();
            if (data.provList) {
                setProvinces(data.provList);
            }
        } catch (error) {
            console.error('Error fetching provinces:', error);
            toast.error('Errore nel caricamento delle province');
        } finally {
            setIsLoading(prev => ({ ...prev, provinces: false }));
        }
    };

    const fetchComuni = async (sigla: string) => {
        setIsLoadingComuni(true);
        try {
            const response = await fetch(`/api/leads/location/comuni-by-province?sigla=${encodeURIComponent(sigla)}`);
            const data = await response.json();
            if (data.comuni) {
                setAvailableComuni(data.comuni);
            }
        } catch (error) {
            console.error('Error fetching comuni:', error);
            toast.error('Errore nel caricamento dei comuni');
        } finally {
            setIsLoadingComuni(false);
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRegion(e.target.value);
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const province = provinces.find(p => p.sigla === selectedValue);
        setSelectedProvince(province || null);
        setSelectedComuni([]);
    };

    const handleComuniChange = (comune: string) => {
        setSelectedComuni(prev => 
            prev.includes(comune)
                ? prev.filter(c => c !== comune)
                : [...prev, comune]
        );
    };

    const handleCustomRegionsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUseCustomRegions(e.target.checked);
        if (!e.target.checked) {
            setSelectedRegion('');
            setSelectedProvince(null);
            setSelectedComuni([]);
        }
    };

    const handleDeleteTask = async () => {
        if (!scheduledTask) return;

        try {
            const response = await fetch(`/api/leads/scheduled-task?taskId=${scheduledTask.task_id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setScheduledTask(null);
                toast.success('Ricerca programmata eliminata con successo');
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            toast.error("Errore durante l'eliminazione della ricerca programmata");
        }
    };

    const years = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 2025 - i);

    return (
        <>
            <div className="shadow-md rounded-2xl my-2 overflow-hidden bg-white">
                <div className="p-4 bg-neutral-300">
                    <label className="block font-bold text-gray-700 mb-2">Seleziona Piattaforme</label>
                    <div className="grid grid-cols-2 gap-2">
                        {platforms.map((platform) => (
                            <label
                                key={platform.value}
                                className="flex items-center space-x-2 bg-white p-2 rounded-md cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.selectedPlatforms.includes(platform.value)}
                                    onChange={() => handlePlatformToggle(platform.value)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="text-sm">{platform.title}</span>
                            </label>
                        ))}
                    </div>
                    {formData.selectedPlatforms.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                            Piattaforme selezionate: {formData.selectedPlatforms.length}
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div>
                        <div className="flex">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700">Anno Da</label>
                                <select
                                    name="yearFrom"
                                    value={formData.yearFrom}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Qualsiasi</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 ml-4">
                                <label className="block text-sm font-bold text-gray-700">Anno A</label>
                                <select
                                    name="yearTo"
                                    value={formData.yearTo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Qualsiasi</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700">Km Da</label>
                                <select
                                    name="mileageFrom"
                                    value={formData.mileageFrom}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Qualsiasi</option>
                                    {[0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 250000, 300000, 350000, 400000, 450000, 500000].map(km => (
                                        <option key={km} value={km}>{km} km</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 ml-4">
                                <label className="block text-sm font-bold text-gray-700">Km A</label>
                                <select
                                    name="mileageTo"
                                    value={formData.mileageTo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                >
                                    <option value="">Qualsiasi</option>
                                    {[0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 250000, 300000, 350000, 400000, 450000, 500000].map(km => (
                                        <option key={km} value={km}>{km} km</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="mt-4">
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id="useCustomRegions"
                                        checked={useCustomRegions}
                                        onChange={handleCustomRegionsToggle}
                                        className="mr-2 form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label htmlFor="useCustomRegions" className="text-sm font-bold text-gray-700">
                                        Usa regioni e province personalizzate
                                    </label>
                                </div>

                                {useCustomRegions && (
                                    <div className="mt-2 space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Regione</label>
                                            <select
                                                value={selectedRegion}
                                                onChange={handleRegionChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                disabled={isLoading.regions}
                                            >
                                                <option value="">Seleziona una regione</option>
                                                {regions.map(region => (
                                                    <option key={region} value={region}>{region}</option>
                                                ))}
                                            </select>
                                            {isLoading.regions && <p className="text-sm text-gray-500 mt-1">Caricamento regioni...</p>}
                                        </div>

                                        {selectedRegion && (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Provincia</label>
                                                {isLoading.provinces ? (
                                                    <p className="text-sm text-gray-500">Caricamento province...</p>
                                                ) : (
                                                    <select
                                                        value={selectedProvince?.sigla || ''}
                                                        onChange={handleProvinceChange}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                                                    >
                                                        <option value="">Seleziona una provincia</option>
                                                        {provinces.map(province => (
                                                            <option key={province.sigla} value={province.sigla}>
                                                                {province.denominazione}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        )}

                                        {selectedProvince && (
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Comuni</label>
                                                {isLoadingComuni ? (
                                                    <p className="text-sm text-gray-500">Caricamento comuni...</p>
                                                ) : (
                                                    <div className="mt-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm text-gray-600">
                                                                Comuni selezionati: {selectedComuni.length}
                                                            </span>
                                                            {selectedComuni.length > 0 && (
                                                                <button
                                                                    onClick={() => setSelectedComuni([])}
                                                                    className="text-sm text-red-600 hover:text-red-800"
                                                                >
                                                                    Deseleziona tutti
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-2">
                                                            {availableComuni.map(comune => (
                                                                <label
                                                                    key={comune}
                                                                    className="flex items-center space-x-2 bg-white p-2 rounded-md cursor-pointer hover:bg-gray-50 border border-gray-200"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedComuni.includes(comune)}
                                                                        onChange={() => handleComuniChange(comune)}
                                                                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                                                    />
                                                                    <span className="text-sm truncate" title={comune}>
                                                                        {comune}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-4">
                            <b>Comuni in cui verrà svolta la ricerca: </b>
                            {useCustomRegions && selectedComuni.length > 0
                                ? selectedComuni.toString().replaceAll(',', ', ')
                                : comuni?.toString().replaceAll(',', ', ') ?? 'Qualsiasi'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 shadow-xl pb-4 rounded-xl overflow-hidden bg-white">
                <div>
                    <div className="bg-neutral-200 py-4 px-4">
                        <h2 className="text-xl font-bold uppercase">Ricerca immediata</h2>
                    </div>
                    <div className="m-4">
                        <button
                            onClick={handleImmediateSearch}
                            disabled={isLoading.immediate || isLoading.scheduled}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white px-4 py-2 rounded-md w-full font-bold"
                        >
                            {isLoading.immediate ? 'Ricerca in corso...' : 'Cerca'}
                        </button>
                    </div>
                </div>
                <div>
                    <div className="bg-neutral-200 py-4 px-4">
                        <h2 className="text-xl font-bold uppercase">Ricerca programmata</h2>
                    </div>
                    <div className="m-4 space-y-2">
                        {isLoadingTask ? (
                            <div className="text-center py-4">Caricamento...</div>
                        ) : scheduledTask ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">Hai una ricerca programmata ogni {scheduledTask.schedule_repeat_h} ore a partire dalle {scheduledTask.schedule_start}</p>
                                            {(() => {
                                                try {
                                                    const content = JSON.parse(scheduledTask.schedule_content);
                                                    return Object.entries(content).map(([platform, data]: [string, any]) => (
                                                        <div key={platform} className="mt-2 text-sm text-gray-600">
                                                            <p><strong>{platforms.find(p => p.value === platform)?.title}:</strong></p>
                                                            <p>Anno da {data.yearFrom || 'qualsiasi'} a {data.yearTo || 'qualsiasi'}</p>
                                                            <p>Km da {data.mileageFrom || 'qualsiasi'} a {data.mileageTo || 'qualsiasi'}</p>
                                                        </div>
                                                    ));
                                                } catch (e) {
                                                    return null;
                                                }
                                            })()}
                                        </div>
                                        <button
                                            onClick={handleDeleteTask}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block font-medium">Orario inizio</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded-md w-full"
                                        placeholder="--:--"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Ripeti ogni</label>
                                    <select
                                        name="repeatInterval"
                                        value={formData.repeatInterval}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 px-3 py-2 rounded-md w-full"
                                    >
                                        <option value="">Seleziona</option>
                                        <option value="1">1 ora</option>
                                        <option value="2">2 ore</option>
                                        <option value="4">4 ore</option>
                                        <option value="6">6 ore</option>
                                        <option value="8">8 ore</option>
                                        <option value="12">12 ore</option>
                                        <option value="24">24 ore</option>
                                    </select>
                                </div>
                                <div>
                                    <button
                                        onClick={handleScheduledSearch}
                                        disabled={isLoading.immediate || isLoading.scheduled}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-4 py-2 rounded-md w-full text-center font-bold"
                                    >
                                        {isLoading.scheduled ? 'Programmazione in corso...' : 'Esegui'}
                                    </button>
                                    <div className="flex items-center my-2">
                                        <span className="mr-2">Attiva Spoki</span>
                                        <input
                                            type="checkbox"
                                            name="isSpokiActive"
                                            checked={formData.isSpokiActive}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}