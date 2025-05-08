'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FlagIcon, MailOpen, PhoneCallIcon, Users2Icon} from 'lucide-react';

export function Calendar({
	parsedActivities,
	selectActivity,
	updateEventDates,
	handleDateClick,
}: any) {
	//CUSTOM ICON ON CALENDAR EVENT
	const renderEventContent = (eventInfo: any) => {
		return (
			<div className="flex gap-1 items-center w-full">
				{eventInfo.event._def.action === 'call' && (
					<PhoneCallIcon className="w-3.5 h-3.5" />
				)}
				{eventInfo.event._def.action === 'meeting' && (
					<Users2Icon className="w-3.5 h-3.5" />
				)}
				{eventInfo.event._def.action === 'email' && (
					<MailOpen className="w-3.5 h-3.5" />
				)}
				{eventInfo.event._def.action === 'expiration' && (
					<FlagIcon className="w-3.5 h-3.5" />
				)}
				<p className="truncate"> {eventInfo.event.title} </p>
			</div>
		);
	};

	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,aggiungiAttivita,timeGridDay',
				}}
				initialView="timeGridWeek"
				height={'100%'}
				locale={'it'}
				buttonText={{
					today: 'Oggi',
					month: 'Mese',
					week: 'Settimana',
					day: 'Giorno',
				}}
				firstDay={1}
				nowIndicator={true}
				editable={true}
				selectable={true}
				selectMirror={true}
				droppable={true}
				events={parsedActivities}
				eventContent={renderEventContent}
				eventClick={event => selectActivity(event.event._def, event.event.id)}
				eventDrop={data =>
					updateEventDates(
						Number(data.event.id),
						data.event.startStr,
						data.event.endStr
					)
				}
				eventResize={data =>
					updateEventDates(
						Number(data.event.id),
						data.event.startStr,
						data.event.endStr
					)
				}
				select={date => handleDateClick(date.startStr, date.endStr)}
			/>
		</>
	);
}
