import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="hero-content">
            <div className="fade-in">
              <h1 className="display-3 fw-bold mb-4">
                Your Path to Educational Success
              </h1>
              <p className="lead mb-4 opacity-75">
                Discover the right career path and educational opportunities tailored for J&K students. 
                Get personalized guidance, explore colleges, find scholarships, and plan your future.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  variant="light" 
                  size="lg" 
                  className="px-4 py-3 shadow"
                  onClick={() => window.location.href = '/quiz'}
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Start Career Quiz
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="px-4 py-3"
                  onClick={() => window.location.href = '/colleges'}
                >
                  <i className="bi bi-building me-2"></i>
                  Explore Colleges
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div className="slide-in-right">
              <div className="hero-image">
                <div className="feature-icon mx-auto mb-4" style={{ width: '200px', height: '200px' }}>
                  <i className="bi bi-mortarboard" style={{ fontSize: '4rem' }}></i>
                </div>
                <div className="floating-elements">
                  <div className="floating-icon" style={{ animationDelay: '0s' }}>
                    <i className="bi bi-book"></i>
                  </div>
                  <div className="floating-icon" style={{ animationDelay: '1s' }}>
                    <i className="bi bi-trophy"></i>
                  </div>
                  <div className="floating-icon" style={{ animationDelay: '2s' }}>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      <style jsx>{`
        .floating-elements {
          position: relative;
          height: 200px;
          width: 200px;
          margin: 0 auto;
        }
        
        .floating-icon {
          position: absolute;
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }
        
        .floating-icon:nth-child(1) {
          top: 20px;
          right: 20px;
        }
        
        .floating-icon:nth-child(2) {
          bottom: 20px;
          left: 20px;
        }
        
        .floating-icon:nth-child(3) {
          top: 50%;
          left: -30px;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .hero-image {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
