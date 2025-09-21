import React from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';

const MentorNetwork = () => {
  // Mock data for mentors
  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Tech Industry Expert',
      expertise: ['Software Development', 'AI', 'Career Transitions'],
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      availability: 'Available',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      role: 'Academic Advisor',
      expertise: ['Higher Education', 'Research', 'Scholarships'],
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      availability: 'Available',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Priya Sharma',
      role: 'Career Coach',
      expertise: ['Interview Prep', 'Resume Building', 'Networking'],
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      availability: 'Busy',
      rating: 4.7
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Industry Professional',
      expertise: ['Business', 'Entrepreneurship', 'Leadership'],
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      availability: 'Available',
      rating: 4.9
    }
  ];

  return (
    <div id="mentors" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary mb-3">Connect with Expert Mentors</h2>
          <p className="lead">Get guidance from industry professionals and academic experts</p>
        </div>

        <Row>
          {mentors.map(mentor => (
            <Col md={3} sm={6} className="mb-4" key={mentor.id}>
              <Card className="h-100 shadow-sm border-0 mentor-card">
                <div className="text-center pt-4">
                  <div className="mentor-image-container mb-3">
                    <img 
                      src={mentor.image} 
                      alt={mentor.name} 
                      className="rounded-circle mentor-image"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <span className={`status-indicator ${mentor.availability === 'Available' ? 'bg-success' : 'bg-warning'}`}></span>
                  </div>
                  <h3 className="h5 mb-1">{mentor.name}</h3>
                  <p className="text-muted mb-2">{mentor.role}</p>
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <span className="me-1">⭐</span>
                    <span className="fw-bold">{mentor.rating}</span>
                  </div>
                </div>
                <Card.Body className="pt-0">
                  <div className="mb-3">
                    <p className="small text-muted mb-2">Expertise:</p>
                    <div>
                      {mentor.expertise.map((skill, i) => (
                        <Badge bg="light" text="dark" className="me-1 mb-1" key={i}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0 p-3">
                  <Button 
                    variant={mentor.availability === 'Available' ? 'primary' : 'secondary'} 
                    className="w-100"
                    disabled={mentor.availability !== 'Available'}
                  >
                    {mentor.availability === 'Available' ? 'Schedule Session' : 'Currently Unavailable'}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-4">
          <Button variant="outline-primary" size="lg">
            View All Mentors
          </Button>
        </div>
      </div>
      
      <style jsx>{`
        .mentor-image-container {
          position: relative;
          display: inline-block;
        }
        .status-indicator {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid white;
        }
        .mentor-card {
          transition: transform 0.3s ease;
        }
        .mentor-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default MentorNetwork;