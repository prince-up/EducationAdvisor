import React from 'react';
import { Card } from 'react-bootstrap';

const FeatureCard = ({ icon, title, description, link, delay = 0 }) => {
  return (
    <div className="col-md-4 mb-4">
      <Card className="feature-card h-100 fade-in" style={{ animationDelay: `${delay}ms` }}>
        <Card.Body className="text-center">
          <div className="feature-icon">
            <i className={icon}></i>
          </div>
          <h4 className="fw-bold mb-3">{title}</h4>
          <p className="text-muted mb-4">{description}</p>
          <a href={link} className="btn btn-outline-primary">
            Learn More <i className="bi bi-arrow-right ms-2"></i>
          </a>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FeatureCard;
