import {createContext} from 'react';

interface InitialState {
	agency: string;
	agencyEmail: string;
	setAgency: (agency: string) => void;
	setAgencyEmail: (agencyMail: string) => void;
	lastSpokiChat: string;
	setLastSpokiChat: (lastSpokiChat: string) => void;
}

const initialState: InitialState = {
	agency: '',
	agencyEmail: '',
	setAgency: () => {},
	setAgencyEmail: () => {},
	lastSpokiChat: '',
	setLastSpokiChat: () => {},
};

const AppContext = createContext<InitialState>(initialState);

export default AppContext;
