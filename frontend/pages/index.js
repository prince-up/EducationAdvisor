import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Navbar, Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
// Temporary mock for useAuth
const useAuth = () => {
  return {
    user: { id: 1, name: 'Test User' },
    loading: false,
    isAuthenticated: () => true,
    logout: () => console.log('Mock logout')
  };
};
import ProtectedRoute from '../components/ProtectedRoute';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import StatsSection from '../components/StatsSection';
import VoiceChatbot from '../components/VoiceChatbot';
import AIRecommendation from '../components/AIRecommendation';
import MentorNetwork from '../components/MentorNetwork';
import SkillDevelopment from '../components/SkillDevelopment';
import PersonalizedAssessment from '../components/PersonalizedAssessment';

export default function Home() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;
  const logout = auth.logout;

  // Check online status
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  }
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-vh-100">
      <Head>
        <title>CareerPath AI | AI-Powered Career Education Platform</title>
        <meta name="description" content="Discover your perfect career path with AI-powered recommendations, personalized learning, and comprehensive guidance" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <Navbar bg="primary" variant="dark" expand="lg" className="mb-0 py-3">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">
            <i className="bi bi-mortarboard-fill me-2"></i>
            CareerPath AI
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="fw-semibold mx-2">Home</Nav.Link>
              <Nav.Link href="/colleges" className="fw-semibold mx-2">Colleges</Nav.Link>
              <Nav.Link href="/scholarships" className="fw-semibold mx-2">Scholarships</Nav.Link>
              <Nav.Link href="/quiz" className="fw-semibold mx-2">Career Quiz</Nav.Link>
              <Nav.Link href="#ai-recommendations" className="fw-semibold mx-2">AI Recommendations</Nav.Link>
              <Nav.Link href="#mentors" className="fw-semibold mx-2">Mentors</Nav.Link>
            </Nav>
            <Nav>
              <div className="d-flex align-items-center">
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-3 px-3 py-2" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
                <LanguageSwitcher />
                <div className="ms-3">
                  {isOnline ? (
                    <Badge bg="success" className="px-3 py-2">
                      <i className="bi bi-wifi me-1"></i>
                      Online
                    </Badge>
                  ) : (
                    <Badge bg="danger" className="px-3 py-2">
                      <i className="bi bi-wifi-off me-1"></i>
                      Offline
                    </Badge>
                  )}
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-gradient mb-3">
                Everything You Need for Success
              </h2>
              <p className="lead text-muted">
                Comprehensive tools and resources to guide your educational journey
              </p>
            </Col>
          </Row>
          <Row>
            <FeatureCard 
              icon="bi-clipboard-check"
              title="Career Aptitude Test"
              description="Discover your strengths and find the perfect career match with our comprehensive aptitude assessment"
              link="/quiz"
              delay={0}
            />
            <FeatureCard 
              icon="bi-building"
              title="College Explorer"
              description="Browse through hundreds of colleges and universities to find the perfect fit for your educational journey"
              link="/colleges"
              delay={200}
            />
            <FeatureCard 
              icon="bi-award"
              title="Scholarship Finder"
              description="Access thousands of scholarships and financial aid opportunities to fund your education"
              link="/scholarships"
              delay={400}
            />
          </Row>
        </Container>
      </section>

      {/* Statistics Section */}
      <StatsSection />
      
      {/* Personalized Assessment Section */}
      <PersonalizedAssessment />
      
      {/* AI Recommendation Section */}
      <AIRecommendation />
      
      {/* Mentor Network Section */}
      <MentorNetwork />
      
      {/* Skill Development Section */}
      <SkillDevelopment />

      {/* Call to Action Section */}
      <section className="py-5 bg-gradient-primary text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-5 fw-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="lead mb-4 opacity-75">
                Join thousands of students who have already discovered their path to success
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button 
                  variant="light" 
                  size="lg" 
                  className="px-4 py-3 shadow"
                  onClick={() => router.push('/quiz')}
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Take Career Quiz
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="px-4 py-3"
                  onClick={() => router.push('/colleges')}
                >
                  <i className="bi bi-building me-2"></i>
                  Explore Colleges
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={6}>
              <h5 className="fw-bold mb-3">
                <i className="bi bi-mortarboard me-2"></i>
                Digital Career Advisor
              </h5>
              <p className="text-light opacity-75">
                Empowering Jammu & Kashmir students with comprehensive career guidance and educational planning tools.
              </p>
            </Col>
            <Col md={3}>
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><a href="/colleges" className="text-light text-decoration-none">Colleges</a></li>
                <li><a href="/scholarships" className="text-light text-decoration-none">Scholarships</a></li>
                <li><a href="/quiz" className="text-light text-decoration-none">Career Quiz</a></li>
                <li><a href="/profile" className="text-light text-decoration-none">Profile</a></li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="fw-bold mb-3">Support</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">Help Center</a></li>
                <li><a href="#" className="text-light text-decoration-none">Contact Us</a></li>
                <li><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
                <li><a href="#" className="text-light text-decoration-none">Terms of Service</a></li>
              </ul>
            </Col>
          </Row>
          <hr className="my-4" />
          <Row>
            <Col>
              <div className="text-center">
                <p className="mb-0 text-light opacity-75">
                  &copy; 2024 Digital Career Advisor. All rights reserved. | Made with ❤️ for J&K Students
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Voice Chatbot - Always visible */}
      <VoiceChatbot />
    </div>
  );
}