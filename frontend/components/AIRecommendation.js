import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Badge, ProgressBar } from 'react-bootstrap';

const AIRecommendation = () => {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for recommendations
  const mockRecommendations = [
    {
      title: 'Software Engineering',
      match: 95,
      description: 'Based on your strong analytical skills and interest in problem-solving, software engineering would be an excellent career path.',
      skills: ['Programming', 'Problem Solving', 'Logical Thinking'],
      courses: ['Computer Science', 'Software Development', 'Data Structures']
    },
    {
      title: 'Data Science',
      match: 88,
      description: 'Your mathematical background and interest in patterns makes data science a great fit for your profile.',
      skills: ['Statistics', 'Machine Learning', 'Data Visualization'],
      courses: ['Statistics', 'Machine Learning', 'Big Data Analytics']
    },
    {
      title: 'UX/UI Design',
      match: 82,
      description: 'Your creative skills combined with analytical thinking make you well-suited for UX/UI design roles.',
      skills: ['Design Thinking', 'User Research', 'Visual Design'],
      courses: ['User Experience Design', 'Interface Design', 'Human-Computer Interaction']
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1500);
  };

  return (
    <div id="ai-recommendations" className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary mb-3">AI Career Recommendations</h2>
          <p className="lead">Get personalized career recommendations powered by advanced AI algorithms</p>
        </div>

        {!recommendations ? (
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Your Skills</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="List your skills (e.g., programming, writing, analysis)"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Your Interests</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="What subjects or activities interest you?"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center mt-3">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="px-5"
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Get AI Recommendations'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <div>
            <Row>
              {recommendations.map((rec, index) => (
                <Col md={4} className="mb-4" key={index}>
                  <Card className="h-100 shadow-sm border-0 hover-card">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="h4 mb-0">{rec.title}</h3>
                        <Badge bg="primary" className="px-3 py-2">{rec.match}% Match</Badge>
                      </div>
                      <ProgressBar 
                        variant="success" 
                        now={rec.match} 
                        className="mb-3" 
                        style={{height: '8px'}}
                      />
                      <p className="text-muted">{rec.description}</p>
                      <div className="mb-3">
                        <h5 className="h6">Key Skills:</h5>
                        <div>
                          {rec.skills.map((skill, i) => (
                            <Badge bg="light" text="dark" className="me-2 mb-2 px-3 py-2" key={i}>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="h6">Recommended Courses:</h5>
                        <div>
                          {rec.courses.map((course, i) => (
                            <Badge bg="info" className="me-2 mb-2 px-3 py-2" key={i}>
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0 p-4 pt-0">
                      <Button variant="outline-primary" className="w-100">
                        Explore This Path
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={() => setRecommendations(null)}
              >
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;