import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const StatsSection = () => {
  const stats = [
    { number: '500+', label: 'Colleges', icon: 'bi-building' },
    { number: '1000+', label: 'Scholarships', icon: 'bi-award' },
    { number: '50+', label: 'Career Paths', icon: 'bi-briefcase' },
    { number: '10K+', label: 'Students Helped', icon: 'bi-people' }
  ];

  return (
    <section className="stats-section">
      <Container>
        <Row>
          <Col>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-gradient mb-3">
                Trusted by Thousands of Students
              </h2>
              <p className="lead text-muted">
                Join the growing community of successful students from Jammu & Kashmir
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          {stats.map((stat, index) => (
            <Col key={index} md={3} sm={6}>
              <div className="stat-item slide-in-left" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="mt-3">
                  <i className={`bi ${stat.icon} text-primary`} style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StatsSection;
