import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { eventsApi } from '../services/api';
import EventModal from './EventModal';
import ruLocale from '@fullcalendar/core/locales/ru';
import './FullCalendar.css';

const SimpleCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    //загрузка событий
    const loadEvents = async () => {
        try {
            const response = await eventsApi.getEvents();
            const simpleEvents = response.data.map(event => ({
                id: event.id.toString(),
                title: event.title,
                start: event.startDate,
                end: event.endDate,
                color: event.color,
                description: event.description || ''
            }));
            setEvents(simpleEvents);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    };

    //редактировать
    const handleEventClick = (info) => {
        setCurrentEvent({
            id: parseInt(info.event.id),
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            color: info.event.backgroundColor,
            description: info.event.extendedProps.description || ''
        });
        setShowModal(true);
    };

    //клик по пустой дате
    const handleDateClick = (info) => {
        setCurrentEvent(null);
        setShowModal(true);
    };
    
    //сохранение
    const handleSave = async (eventData) => {
        try {
            if (currentEvent) {//обновляем
                await eventsApi.updateEvent(currentEvent.id, eventData);
            } else {//создаем
                await eventsApi.createEvent(eventData);
            }
            setShowModal(false);
            loadEvents(); 
        } catch (error) {
            alert('Ошибка сохранения');
            console.error(error);
        }
    };

    //удаление
    const handleDelete = async (eventId) => {
        try {
            await eventsApi.deleteEvent(eventId);
            setShowModal(false);
            loadEvents();
        } catch (error) {
            alert('Ошибка удаления');
            console.error(error);
        }
    };

    return (
        <div className="simple-calendar">
            <h1>Мой Календарь</h1>
            
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={ruLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                editable={true}
                height="auto"
                buttonText={{
                    today: 'Сегодня',
                    month: 'Месяц',
                    week: 'Неделя',
                    day: 'День'
                }}
            />

            {showModal && (
                <EventModal
                    event={currentEvent}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default SimpleCalendar;