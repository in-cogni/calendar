import React, { useState, useEffect } from 'react';

const SimpleEventModal = ({ event, onSave, onDelete, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('#3788d8');

    useEffect(() => {
        if (event) {//редактирование
            setTitle(event.title);
            setDescription(event.description || '');
            setColor(event.color || '#3788d8');
            
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            
            setStart(startDate.toISOString().slice(0, 16));
            setEnd(endDate.toISOString().slice(0, 16));
        } else {//создание
            const now = new Date();
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            
            setTitle('');
            setDescription('');
            setColor('#3788d8');
            setStart(now.toISOString().slice(0, 16));
            setEnd(oneHourLater.toISOString().slice(0, 16));
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            alert('Введите название события');
            return;
        }

        const eventData = {
            title: title.trim(),
            description: description.trim(),
            startDate: new Date(start),
            endDate: new Date(end),
            color: color
        };

        onSave(eventData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{event ? 'Редактировать событие' : 'Новое событие'}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название события:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите название"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание (необязательно)"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Начало:</label>
                        <input
                            type="datetime-local"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Окончание:</label>
                        <input
                            type="datetime-local"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Цвет:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="btn-primary">
                            {event ? 'Обновить' : 'Создать'}
                        </button>
                        
                        {event && (
                            <button 
                                type="button" 
                                onClick={() => onDelete(event.id)}
                                className="btn-danger"
                            >
                                Удалить
                            </button>
                        )}
                        
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SimpleEventModal;