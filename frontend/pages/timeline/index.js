import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout';
import { useAuth } from '../../services/auth';
import api from '../../services/api';

export default function Timeline() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [timeline, setTimeline] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    event_type: 'task'
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=timeline');
      return;
    }

    const fetchTimeline = async () => {
      try {
        const timelineRes = await api.get('/timeline/me');
        setTimeline(timelineRes.data);

        if (timelineRes.data) {
          const eventsRes = await api.get(`/timeline/${timelineRes.data.id}/events`);
          setEvents(eventsRes.data);
        }
      } catch (err) {
        console.error('Error fetching timeline:', err);
        setError(t('timeline.error.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [isAuthenticated, router, t]);

  const handleCreateTimeline = async () => {
    try {
      setLoading(true);
      const response = await api.post('/timeline/', {
        title: t('timeline.defaultTitle'),
        description: t('timeline.defaultDescription')
      });
      setTimeline(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error creating timeline:', err);
      setError(t('timeline.error.createFailed'));
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post(`/timeline/${timeline.id}/events`, newEvent);
      setEvents(prev => [...prev, response.data]);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        event_type: 'task'
      });
      setShowAddEvent(false);
      setLoading(false);
    } catch (err) {
      console.error('Error adding event:', err);
      setError(t('timeline.error.addEventFailed'));
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm(t('timeline.confirmDelete'))) return;
    
    try {
      setLoading(true);
      await api.delete(`/timeline/events/${eventId}`);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setLoading(false);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(t('timeline.error.deleteEventFailed'));
      setLoading(false);
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'task':
        return 'bi-check-square';
      case 'deadline':
        return 'bi-calendar-event';
      case 'milestone':
        return 'bi-flag';
      default:
        return 'bi-circle';
    }
  };

  const getEventTypeClass = (type) => {
    switch (type) {
      case 'task':
        return 'bg-primary';
      case 'deadline':
        return 'bg-danger';
      case 'milestone':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <Layout title={t('timeline.title')}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!timeline) {
    return (
      <Layout title={t('timeline.title')}>
        <div className="card shadow">
          <div className="card-body text-center p-5">
            <h2 className="mb-4">{t('timeline.noTimeline')}</h2>
            <p className="lead mb-4">{t('timeline.createPrompt')}</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleCreateTimeline}
            >
              {t('timeline.createButton')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t('timeline.title')}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{timeline.title}</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddEvent(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          {t('timeline.addEvent')}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {showAddEvent && (
        <div className="card shadow mb-4">
          <div className="card-header">
            <h5 className="mb-0">{t('timeline.newEvent')}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddEvent}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">{t('timeline.form.title')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">{t('timeline.form.description')}</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={newEvent.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="mb-3">
                <label htmlFor="date" className="form-label">{t('timeline.form.date')}</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="event_type" className="form-label">{t('timeline.form.type')}</label>
                <select
                  className="form-select"
                  id="event_type"
                  name="event_type"
                  value={newEvent.event_type}
                  onChange={handleInputChange}
                >
                  <option value="task">{t('timeline.eventTypes.task')}</option>
                  <option value="deadline">{t('timeline.eventTypes.deadline')}</option>
                  <option value="milestone">{t('timeline.eventTypes.milestone')}</option>
                </select>
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAddEvent(false)}
                >
                  {t('timeline.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('timeline.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {events.length > 0 ? (
        <div className="timeline-container position-relative">
          <div className="timeline-line position-absolute"></div>
          
          {events
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((event, index) => (
              <div key={event.id} className="timeline-item row mb-4">
                <div className="col-md-2 text-md-end">
                  <div className="timeline-date fw-bold">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="col-md-10 position-relative">
                  <div className={`timeline-marker ${getEventTypeClass(event.event_type)}`}>
                    <i className={`bi ${getEventTypeIcon(event.event_type)}`}></i>
                  </div>
                  
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title">{event.title}</h5>
                          <span className="badge bg-secondary mb-2">
                            {t(`timeline.eventTypes.${event.event_type}`)}
                          </span>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      
                      {event.description && (
                        <p className="card-text">{event.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          {t('timeline.noEvents')}
        </div>
      )}

      <style jsx>{`
        .timeline-container {
          padding-left: 20px;
        }
        
        .timeline-line {
          left: calc(16.66% + 10px);
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #dee2e6;
        }
        
        .timeline-marker {
          position: absolute;
          left: -20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 1;
        }
        
        @media (max-width: 767.98px) {
          .timeline-line {
            left: 20px;
          }
          
          .timeline-date {
            margin-left: 50px;
            margin-bottom: 10px;
          }
          
          .timeline-marker {
            left: 0;
          }
        }
      `}</style>
    </Layout>
  );
}