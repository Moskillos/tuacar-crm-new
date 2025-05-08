"use client";
import { ArrowDownToLine } from "lucide-react";
import { useEffect, useState } from "react";
import { RefreshCcw, MessagesSquare } from "lucide-react";
import { motion } from "framer-motion";
import Image from 'next/image';
import { Spinner } from "@radix-ui/themes";
import { useAppContext } from "@/hooks/useAppContext";

export default function Spoki() {

	const {
		agency,
		lastSpokiChat
	}: any = useAppContext();

	const [useSpokiChat, setUseSpokiChat] = useState("")
	useEffect(() => {
		if (lastSpokiChat && lastSpokiChat != '') {
			setUseSpokiChat(lastSpokiChat)
		}
	}, [lastSpokiChat])

	const [isNull, setIsNull] = useState(false)
	const [errorMsg, setErrorMsg] = useState("")
	const [spokiAgency, setSpokiAgency] = useState<any>(null)
	const [updateSpokiAgency, setUpdateSpokiAgency] = useState<any>(null)
	const [updateSpokiAgencyLoading, setUpdateSpokiAgencyLoading] = useState<any>(false)

	useEffect(() => {
		async function initSpoki() {
			
			const requestOptions: RequestInit = {
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/json",
					"X-Spoki-Api-Key": spokiAgency.spokiApiKey
				}),
				body: JSON.stringify({
					email: spokiAgency.agencyEmail,
					private_key: spokiAgency.spokiSecretKey
				}),
				redirect: "follow",
			};

			const authResponse = await fetch("https://app.spoki.it/api/1/auth/get_authentication_token/", requestOptions);
			const { token, uid } = await authResponse.json();

			let chatLink = '';
			if (useSpokiChat && useSpokiChat != '') {
				const requestOptions: RequestInit = {
					method: "GET",
					headers: new Headers({
						"X-Spoki-Api-Key": spokiAgency.spokiApiKey ? spokiAgency.spokiApiKey : ""
					}),
				};

				const response = await fetch(`https://app.spoki.it/api/1/contacts/?search=${useSpokiChat}`, requestOptions);
				const data = await response.json();

				try {
					chatLink = data.results[0]['chat_link'].replace("https://spoki.app/chats/", "");
				} catch {
					console.log("can't fetch chat link");
				}
			}

			if (token && uid) {
				const pageSlug = chatLink !== '' ? `chats/${chatLink}` : 'chats';
				const iframeParent = document.getElementById("spoki-embedding");
				const iframeEl = document.createElement("iframe");
				iframeEl.setAttribute("frameborder", "0");
				iframeEl.setAttribute(
					"src",
					`https://spoki.app/${pageSlug}?auth_token=${token}&auth_uid=${uid}&language=en`
				);
				iframeParent?.appendChild(iframeEl);
				setIsNull(false)
			} else {
				setIsNull(true)
				setErrorMsg("Errore. Inserisci o aggiorna le tue API Key. Contatta l'amministratore per ricevere supporto")
			}
		}
		if (spokiAgency) {
			initSpoki()
		}
	}, [spokiAgency, useSpokiChat])


	const [hiddenChat, setHidden] = useState(true);
	const classNameChatNascosta =
		"fixed bottom-2.5 right-2.5 h-[75px] w-[75px] rounded-full z-50";
	const hideChat = () => {
		setHidden(!hiddenChat);
	};

	//GET AGENCY
	useEffect(() => {
		async function getAgency() {
			try {
				const params = {
					action: 'getAgencyByCode',
					agencyCode: agency
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(params)
				};

				const response = await fetch('/api/agencies', options);
				const data = await response.json();

				if (data.data[0]) {
					setSpokiAgency((prevState: any) => ({
						...prevState,
						spokiApiKey: data.data[0]['spokiApiKey'],
						spokiSecretKey: data.data[0]['spokiSecretKey'],
						agencyEmail: data.data[0]['email']
					}))
					setUpdateSpokiAgency((prevState: any) => ({
						...prevState,
						spokiApiKey: data.data[0]['spokiApiKey'],
						spokiSecretKey: data.data[0]['spokiSecretKey'],
						agencyEmail: data.data[0]['email']
					}))
				} else {
					console.log("nothing")
					setIsNull(true)
					setErrorMsg("Nessuna impostazione trovata per questa agenzia")
				}

			} catch (error) {
				console.error('Failed to fetch spoki settings:', error);
			} finally {
				//setNotesLoading(false);
			}
		}
		if (agency) {
			getAgency()
		}
	}, [agency])

	//UPDATE SPOKI AGENCY
	async function updateSpokiAgencyFunc() {
		try {
			setUpdateSpokiAgencyLoading(true)
			const params = {
				action: 'updateSpokiAgency',
				agencyCode: agency,
				updateSpokiAgency: updateSpokiAgency
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(params)
			};

			const response = await fetch('/api/agencies', options);
			if (response.status === 200) {
				setIsNull(false)
				setSpokiAgency((prevState: any) => ({
					...prevState,
					spokiApiKey: updateSpokiAgency.spokiApiKey,
					spokiSecretKey: updateSpokiAgency.spokiSecretKey,
					agencyEmail: updateSpokiAgency.agencyEmail
				}))
				setUpdateSpokiAgencyLoading(false)
			}
		} catch (err) {
			throw new Error("Can't save Spoki API keys");
		}
	}

	//REFRESH SPOKI
	async function refreshSpoki() {

		const requestOptions: RequestInit = {
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
				"X-Spoki-Api-Key": spokiAgency.spokiApiKey
			}),
			body: JSON.stringify({
				email: spokiAgency.agencyEmail,
				private_key: spokiAgency.spokiSecretKey
			}),
			redirect: "follow",
		};

		const authResponse = await fetch("https://app.spoki.it/api/1/auth/get_authentication_token/", requestOptions);
		const { token, uid } = await authResponse.json();

		let chatLink = '';
		if (useSpokiChat && useSpokiChat != '') {
			const requestOptions: RequestInit = {
				method: "GET",
				headers: new Headers({
					"X-Spoki-Api-Key": spokiAgency.spokiApiKey ? spokiAgency.spokiApiKey : ""
				}),
			};

			const response = await fetch(`https://app.spoki.it/api/1/contacts/?search=${useSpokiChat}`, requestOptions);
			const data = await response.json();

			try {
				chatLink = data.results[0]['chat_link'].replace("https://spoki.app/chats/", "");
			} catch {
				console.log("can't fetch chat link");
			}
		}

		if (token && uid) {
			const pageSlug = chatLink !== '' ? `chats/${chatLink}` : 'chats';
			const iframeParent = document.getElementById("spoki-embedding");
			const iframeEl = document.createElement("iframe");
			iframeEl.setAttribute("frameborder", "0");
			iframeEl.setAttribute(
				"src",
				`https://spoki.app/${pageSlug}?auth_token=${token}&auth_uid=${uid}&language=en`
			);
			iframeParent?.appendChild(iframeEl);
			setIsNull(false)
		} else {
			setIsNull(true)
			setErrorMsg("Errore. Inserisci o aggiorna le tue API Key. Contatta l'amministratore per ricevere supporto")
		}
	}

	//OPEN ALL CHATS
	async function openAllChats() {

		const requestOptions: RequestInit = {
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
				"X-Spoki-Api-Key": spokiAgency.spokiApiKey
			}),
			body: JSON.stringify({
				email: spokiAgency.agencyEmail,
				private_key: "sfffd"
			}),
			redirect: "follow",
		};

		const authResponse = await fetch("https://app.spoki.it/api/1/auth/get_authentication_token/", requestOptions);
		const { token, uid } = await authResponse.json();

		let chatLink = '';

		if (token && uid) {
			const pageSlug = chatLink !== '' ? `chats/${chatLink}` : 'chats';
			const iframeParent = document.getElementById("spoki-embedding");
			const iframeEl = document.createElement("iframe");
			iframeEl.setAttribute("frameborder", "0");
			iframeEl.setAttribute(
				"src",
				`https://spoki.app/${pageSlug}?auth_token=${token}&auth_uid=${uid}&language=en`
			);
			iframeParent?.appendChild(iframeEl);
			setIsNull(false)
		} else {
			setIsNull(true)
			setErrorMsg("Errore. Inserisci o aggiorna le tue API Key. Contatta l'amministratore per ricevere supporto")
		}
	}

	useEffect(() => {
		// Ensure this code only runs on the client side
		const handleLocalStorageUpdate = (event: any) => {
			// Check if the event contains the necessary details
			if (event.detail?.key && event.detail?.value) {
				// Update the state with the new value
				setUseSpokiChat(event.detail.value);
			}
		};

		// Add the event listener when the component mounts
		window.addEventListener('localStorageUpdated', handleLocalStorageUpdate);

		// Cleanup the event listener when the component unmounts
		return () => {
			window.removeEventListener('localStorageUpdated', handleLocalStorageUpdate);
		};
	}, []);

	return (
		<div
			className={
				!hiddenChat
					? "fixed bottom-2.5 right-2.5 h-[700px] w-[450px] border border-5 border-gray-300 rounded-2xl bg-[#f3f0f0] z-50"
					: classNameChatNascosta
			}
		>
			{!hiddenChat &&
				<div className="grid grid-cols-2">
					<div className="flex justify-center items-center px-3 py-3 hover:cursor-pointer hover:bg-gray-200 border-b border-r border-1 border-gray-300 rounded-tl-2xl" onClick={() => openAllChats()}><MessagesSquare /></div>
					<div className="flex justify-center items-center px-3 py-3 hover:cursor-pointer hover:bg-gray-200 border-b border-1 border-gray-300 rounded-tr-2xl" onClick={() => refreshSpoki()}><RefreshCcw /></div>
				</div>
			}
			<motion.div className={`flex justify-center items-center px-3 py-3 ${!hiddenChat ? "hover:bg-gray-200" : ""} hover:cursor-pointer`} onClick={() => hideChat()}>
				{!hiddenChat && <ArrowDownToLine className="text-gray-800" />}
				{hiddenChat && <Image src="/spoki.png" alt="spoki" height="75" width="75" className="rounded-full shadow-xl" />}
			</motion.div>
			<div className="w-full h-full" hidden={hiddenChat}>
				{!isNull &&
					<div id="spoki-embedding" />
				}
				{isNull &&
					<div className="p-4">
						<p className="mb-2">{errorMsg}</p>
						<p className="mb-1 font-light">API Key</p>
						<input className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3 font-light" value={updateSpokiAgency ? updateSpokiAgency.spokiApiKey : ""} onChange={(e) => setUpdateSpokiAgency((prevState: any) => ({
							...prevState,
							spokiApiKey: e.target.value
						}))} />
						<p className="mb-1 font-light">Secret Key</p>
						<input className="rounded-xl border bg-slate-200 border-slate-100 p-2 w-full mb-3 font-light" value={updateSpokiAgency ? updateSpokiAgency.spokiSecretKey : ""} onChange={(e) => setUpdateSpokiAgency((prevState: any) => ({
							...prevState,
							spokiSecretKey: e.target.value
						}))} />
						<button onClick={updateSpokiAgencyFunc} className="rounded-xl bg-lime-500 hover:bg-lime-600 w-full p-2 text-white mt-4">
							{updateSpokiAgencyLoading && (
								<div className="flex justify-center items-center p-1">
									<Spinner />
								</div>
							)}
							{!updateSpokiAgencyLoading && "Salva"}
						</button>
						<p className="mt-2">
							Come ottenere le API key:
						</p>
						<a
							className="text-blue-400"
							href="https://support.spoki.it/en/docs/integrations/embed-spoki-on-your-software/#request-the-api-key"
							target="_blank"
							rel="noopener noreferrer">
							https://support.spoki.it/en/docs/integrations/embed-spoki-on-your-software/#request-the-api-key
						</a>
					</div>
				}
			</div>
		</div>
	);
}