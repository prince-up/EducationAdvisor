import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CollegeCard = ({ college }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-4 h-100 shadow-sm">
      {college.image && (
        <Card.Img 
          variant="top" 
          src={college.image} 
          alt={college.name} 
          style={{ height: '160px', objectFit: 'cover' }} 
        />
      )}
      <Card.Body>
        <Card.Title>{college.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{college.location}</Card.Subtitle>
        
        <div className="mb-2">
          {college.programs?.map((program, index) => (
            <Badge bg="info" className="me-1 mb-1" key={index}>
              {program}
            </Badge>
          ))}
        </div>
        
        <Card.Text>
          {college.description?.length > 100 
            ? `${college.description.substring(0, 100)}...` 
            : college.description}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">
              {t('colleges.tuition')}: ${college.tuition?.toLocaleString() || 'N/A'}
            </small>
          </div>
          <Button variant="outline-primary" size="sm">
            {t('colleges.viewDetails')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CollegeCard;