import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
// Temporarily mock auth until service is fully implemented
const useAuth = () => ({
  user: { id: 1, name: 'Test User' }, // Mock authenticated user
  isAuthenticated: () => true, // Always return authenticated
  logout: () => console.log('Mock logout')
});

const Layout = ({ children, title = 'Digital Career & Education Advisor' }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Head>
        <title>{title} | J&K Students</title>
        <meta name="description" content="Digital Career & Education Advisor for J&K Students" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">
            {t('app.title')}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link href="/" className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>
                  {t('nav.home')}
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/colleges" className={`nav-link ${router.pathname === '/colleges' ? 'active' : ''}`}>
                  {t('nav.colleges')}
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/scholarships" className={`nav-link ${router.pathname === '/scholarships' ? 'active' : ''}`}>
                  {t('nav.scholarships')}
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/quiz" className={`nav-link ${router.pathname === '/quiz' ? 'active' : ''}`}>
                  {t('nav.aptitudeQuiz')}
                </Link>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <Link href="/timeline" className={`nav-link ${router.pathname === '/timeline' ? 'active' : ''}`}>
                      {t('nav.timeline')}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/budget" className={`nav-link ${router.pathname === '/budget' ? 'active' : ''}`}>
                      {t('nav.budget')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex align-items-center">
              <LanguageSwitcher />
              {user ? (
                <div className="dropdown ms-3">
                  <button className="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    {user.full_name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link href="/profile" className="dropdown-item">
                        {t('nav.profile')}
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        {t('nav.logout')}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="ms-3">
                  <Link href="/login" className="btn btn-outline-light me-2">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="btn btn-light">
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 py-4">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="bg-dark text-light py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>{t('footer.about')}</h5>
              <p>{t('footer.description')}</p>
            </div>
            <div className="col-md-3">
              <h5>{t('footer.quickLinks')}</h5>
              <ul className="list-unstyled">
                <li><Link href="/about" className="text-light">{t('footer.aboutUs')}</Link></li>
                <li><Link href="/contact" className="text-light">{t('footer.contactUs')}</Link></li>
                <li><Link href="/privacy" className="text-light">{t('footer.privacy')}</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>{t('footer.connect')}</h5>
              <div className="d-flex gap-3 fs-4">
                <a href="#" className="text-light"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-light"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-light"><i className="bi bi-instagram"></i></a>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="mb-0">&copy; 2023 {t('app.title')}. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;