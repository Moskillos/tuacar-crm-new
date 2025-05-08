'use client';

import {useEffect, useState} from 'react';
import AppContext from './AppContext';

const AppProvider = ({children}: any) => {
	const [agency, setAgency] = useState('');
	const [agencyEmail, setAgencyEmail] = useState('');
	const [lastSpokiChat, setLastSpokiChat] = useState('');

	useEffect(() => {
		const storedValue = localStorage.getItem('agency');
		if (storedValue) {
			setAgency(storedValue);
		}
		const storedAgencyEmail = localStorage.getItem('agencyEmail');
		if (storedAgencyEmail) {
			setAgencyEmail(storedAgencyEmail);
		}
		const lastSpokiChat = localStorage.getItem('lastSpokiChat');
		if (lastSpokiChat) {
			setLastSpokiChat(lastSpokiChat);
		}
	}, []);

	useEffect(() => {
		if (agency) {
			localStorage.setItem('agency', agency);
		}
		if (agencyEmail) {
			localStorage.setItem('agencyEmail', agencyEmail);
		}
		if (lastSpokiChat) {
			localStorage.setItem('lastSpokiChat', lastSpokiChat);
		}
	}, [agency, agencyEmail, lastSpokiChat]);

	return (
		<AppContext.Provider
			value={{
				agency,
				agencyEmail,
				setAgency,
				setAgencyEmail,
				lastSpokiChat,
				setLastSpokiChat,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
