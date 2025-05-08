'use client';
import {motion} from 'framer-motion';
import {Trash2} from 'lucide-react';
import {useState, useEffect} from 'react';
import {toast, Toaster} from 'sonner';

export default function NotesManager({session, agency, lead, setLeads, deal, rent}: any) {
	//GET NOTES
	const [note, setNotes] = useState<any>([]);
	const [notesLoading, setNotesLoading] = useState(true);
	/*
	id
	userId
	agencyCode
	carToBuyId
	carId
	carToRentId
	dealId
	notes
	createdAt
	*/
	const [nota, setNota] = useState({
		//id: '',
		userId: session.user.sub,
		agencyCode: agency,
		carToBuyId: lead != null ? lead.id : null,
		carId: null,
		dealId: deal != null ? deal.dealId : null,
		carToRentId: rent != null ? rent.id : null,
		notes: '',
		//createdAt: new Date()
	});

	useEffect(() => {
		async function getNotes() {
			try {
				const params = {
					action: 'get',
					source: lead != null ? 'lead' : deal != null ? 'deal' : 'rent',
					id: lead != null ? lead.id : deal != null ? deal.dealId : rent.id,
				};

				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(params),
				};

				const response = await fetch('/api/notes', options);
				const data = await response.json();

				setNotes(data.data);
			} catch (error) {
				console.error('Failed to fetch notes:', error);
			} finally {
				setNotesLoading(false);
			}
		}
		getNotes();
	}, []);

	//AGGIUNGI NOTA
	async function addNota() {
		try {
			const params = {
				action: 'add',
				note: nota,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			};

			const response = await fetch('/api/notes', options);
			const data = await response.json();

			setNotes((prevNotes: any) => [...prevNotes, data.data[0]]);
			setLeads((prevItems: any[]) =>
				prevItems.map(item =>
					item.id === lead.id ? {...item, hasNotes: true} : item
				)
			);
			toast('Nota aggiunta');
		} catch (error) {
			console.error('Failed to delete note:', error);
		} finally {
		}
	}

	//DELETE NOTA
	async function deleteNota(id: string) {
		try {
			const params = {
				action: 'delete',
				id: id,
			};

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			};

			const response = await fetch('/api/notes', options);
			await response.json();

			setNotes((prevItems: any[]) => prevItems.filter(item => item.id !== id));
			toast('Nota eliminata');
		} catch (error) {
			console.error('Failed to delete note:', error);
		} finally {
		}
	}

	return (
		<div className="rounded-2xl border border-slate-200">
			<div className="bg-slate-200 rounded-b rounded-2xl p-4 text-slate-800 font-light">
				Note
			</div>
			<Toaster />
			{!notesLoading && note && (
				<div className="p-4">
					{note.map((n: any, index: number) => (
						<div key={index} className="flex items-start gap-2.5 mt-2">
							<div className="flex flex-col gap-1 w-full max-w-full">
								<div className="flex items-center space-x-2 rtl:space-x-reverse">
									<span className="text-xs font-normal text-gray-500 dark:text-gray-400">
										{n.createdAt
											.replace('T', ' ')
											.replace('.000Z', '')
											.split(' ')[0]
											.split('-')
											.reverse()
											.join('-') +
											' ' +
											n.createdAt
												.replace('T', ' ')
												.replace('.000Z', '')
												.split(' ')[1]}
									</span>
								</div>
								<div className="flex justify-between items-center p-4 border-gray-200 bg-gray-200 rounded-e-xl rounded-es-xl dark:bg-gray-700">
									<p className="text-xs font-normal text-gray-900 dark:text-white">
										{n.notes}
									</p>
									<Trash2
										onClick={() => deleteNota(n.id)}
										className="hover:cursor-pointer h-5 w-5"
									/>
								</div>
							</div>
						</div>
					))}
					<textarea
						value={nota.notes}
						onChange={e =>
							setNota(prevState => ({
								...prevState,
								notes: e.target.value,
							}))
						}
						className="rounded-xl bg-slate-200 w-full p-2 mt-4"
					></textarea>
					<motion.button
						onClick={addNota}
						whileHover={{scale: 1.01}}
						whileTap={{scale: 0.99}}
						className="rounded-xl bg-slate-500 hover:bg-slate-600 w-full p-2 text-white"
					>
						Aggiungi nota
					</motion.button>
				</div>
			)}
		</div>
	);
}
