import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { useAuth } from '../services/auth';
import api from '../services/api';

export default function Profile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    district: '',
    education_level: '',
    interests: '',
    career_goals: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        if (response.data) {
          setProfile(response.data);
          setFormData({
            district: response.data.district || '',
            education_level: response.data.education_level || '',
            interests: response.data.interests || '',
            career_goals: response.data.career_goals || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(t('profile.error.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setError('');

    try {
      const method = profile ? 'put' : 'post';
      const endpoint = '/users/profile';
      
      await api[method](endpoint, formData);
      setSuccessMessage(t('profile.success.saved'));
      
      // Refresh profile data
      const response = await api.get('/users/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(t('profile.error.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title={t('profile.title')}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t('profile.title')}>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
              </div>
              <h5 className="card-title">{user?.full_name}</h5>
              <p className="card-text text-muted">{user?.email}</p>
              <p className="card-text">
                <span className="badge bg-primary me-2">{profile?.education_level || t('profile.notSpecified')}</span>
                <span className="badge bg-secondary">{profile?.district || t('profile.notSpecified')}</span>
              </p>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">{t('profile.quickLinks')}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <a href="/timeline" className="text-decoration-none">
                    <i className="bi bi-calendar-check me-2"></i>
                    {t('profile.links.timeline')}
                  </a>
                </li>
                <li className="list-group-item">
                  <a href="/quiz/results" className="text-decoration-none">
                    <i className="bi bi-graph-up me-2"></i>
                    {t('profile.links.quizResults')}
                  </a>
                </li>
                <li className="list-group-item">
                  <a href="/budget" className="text-decoration-none">
                    <i className="bi bi-wallet2 me-2"></i>
                    {t('profile.links.budget')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">{t('profile.form.title')}</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="district" className="form-label">{t('profile.form.district')}</label>
                  <select
                    className="form-select"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                  >
                    <option value="">{t('profile.form.selectDistrict')}</option>
                    <option value="Srinagar">Srinagar</option>
                    <option value="Jammu">Jammu</option>
                    <option value="Anantnag">Anantnag</option>
                    <option value="Baramulla">Baramulla</option>
                    <option value="Budgam">Budgam</option>
                    <option value="Doda">Doda</option>
                    <option value="Ganderbal">Ganderbal</option>
                    <option value="Kathua">Kathua</option>
                    <option value="Kishtwar">Kishtwar</option>
                    <option value="Kulgam">Kulgam</option>
                    <option value="Kupwara">Kupwara</option>
                    <option value="Poonch">Poonch</option>
                    <option value="Pulwama">Pulwama</option>
                    <option value="Rajouri">Rajouri</option>
                    <option value="Ramban">Ramban</option>
                    <option value="Reasi">Reasi</option>
                    <option value="Shopian">Shopian</option>
                    <option value="Udhampur">Udhampur</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="education_level" className="form-label">{t('profile.form.educationLevel')}</label>
                  <select
                    className="form-select"
                    id="education_level"
                    name="education_level"
                    value={formData.education_level}
                    onChange={handleChange}
                  >
                    <option value="">{t('profile.form.selectEducationLevel')}</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="interests" className="form-label">{t('profile.form.interests')}</label>
                  <textarea
                    className="form-control"
                    id="interests"
                    name="interests"
                    rows="3"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder={t('profile.form.interestsPlaceholder')}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="career_goals" className="form-label">{t('profile.form.careerGoals')}</label>
                  <textarea
                    className="form-control"
                    id="career_goals"
                    name="career_goals"
                    rows="3"
                    value={formData.career_goals}
                    onChange={handleChange}
                    placeholder={t('profile.form.careerGoalsPlaceholder')}
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('profile.form.saving')}
                      </>
                    ) : t('profile.form.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}