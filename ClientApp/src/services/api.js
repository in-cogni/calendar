import axios from 'axios';

const API_BASE_URL = 'http://158.160.4.92/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const eventsApi = {
    getEvents: () => api.get('/events'),
    createEvent: (eventData) => api.post('/events', eventData),
    updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
    deleteEvent: (id) => api.delete(`/events/${id}`)
};