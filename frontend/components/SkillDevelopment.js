import React from 'react';
import { Card, Button, Row, Col, ProgressBar, Badge } from 'react-bootstrap';

const SkillDevelopment = () => {
  // Mock data for skill courses
  const courses = [
    {
      id: 1,
      title: 'Programming Fundamentals',
      category: 'Technology',
      level: 'Beginner',
      duration: '8 weeks',
      progress: 65,
      image: '/images/programming.svg',
      skills: ['Python', 'Logic', 'Problem Solving']
    },
    {
      id: 2,
      title: 'Data Analysis Essentials',
      category: 'Data Science',
      level: 'Intermediate',
      duration: '10 weeks',
      progress: 30,
      image: '/images/data-analysis.svg',
      skills: ['Statistics', 'Excel', 'Visualization']
    },
    {
      id: 3,
      title: 'Business Communication',
      category: 'Soft Skills',
      level: 'All Levels',
      duration: '6 weeks',
      progress: 90,
      image: '/images/communication.svg',
      skills: ['Writing', 'Speaking', 'Presentation']
    },
    {
      id: 4,
      title: 'Digital Marketing',
      category: 'Marketing',
      level: 'Beginner',
      duration: '8 weeks',
      progress: 10,
      image: '/images/marketing.svg',
      skills: ['SEO', 'Social Media', 'Analytics']
    }
  ];

  return (
    <div className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary mb-3">Skill Development</h2>
          <p className="lead">Build the skills you need for your dream career</p>
        </div>

        <Row>
          {courses.map(course => (
            <Col lg={3} md={6} className="mb-4" key={course.id}>
              <Card className="h-100 shadow-sm border-0 hover-card">
                <div className="p-3 text-center">
                  <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                       style={{width: '80px', height: '80px'}}>
                    <i className={`bi bi-${course.id === 1 ? 'code-slash' : 
                                          course.id === 2 ? 'bar-chart' : 
                                          course.id === 3 ? 'chat-dots' : 
                                          'graph-up'} fs-1 text-primary`}></i>
                  </div>
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <Badge bg="primary" className="px-3 py-2">{course.category}</Badge>
                    <Badge bg="secondary" className="px-3 py-2">{course.level}</Badge>
                  </div>
                  <h3 className="h5 mb-3">{course.title}</h3>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Progress</span>
                    <span className="text-muted small">{course.progress}%</span>
                  </div>
                  <ProgressBar 
                    variant={course.progress < 30 ? "danger" : course.progress < 70 ? "warning" : "success"} 
                    now={course.progress} 
                    className="mb-3" 
                    style={{height: '8px'}}
                  />
                  <div className="mb-3">
                    <span className="text-muted small d-block mb-2">Skills you'll gain:</span>
                    <div>
                      {course.skills.map((skill, i) => (
                        <Badge bg="light" text="dark" className="me-1 mb-1" key={i}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      <i className="bi bi-clock me-1"></i>
                      {course.duration}
                    </span>
                    <Button variant="outline-primary" size="sm">
                      {course.progress > 0 ? 'Continue' : 'Start Now'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-4">
          <Button variant="primary" size="lg">
            Explore All Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillDevelopment;