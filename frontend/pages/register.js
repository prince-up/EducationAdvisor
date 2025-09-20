import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../services/auth';
import Layout from '../components/Layout';

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError(t('register.error.passwordMismatch'));
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirm_password, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        router.push('/login?registered=true');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(t('register.error.generic'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t('register.title')}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">{t('register.title')}</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label">{t('register.form.fullName')}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">{t('register.form.email')}</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">{t('register.form.username')}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">{t('register.form.password')}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                  />
                  <div className="form-text">{t('register.form.passwordHint')}</div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirm_password" className="form-label">{t('register.form.confirmPassword')}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    minLength="8"
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('register.form.registering')}
                      </>
                    ) : t('register.form.submit')}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p>{t('register.haveAccount')} <Link href="/login" className="text-decoration-none">{t('register.login')}</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}