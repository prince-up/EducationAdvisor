import React, { useState } from 'react';
import { Card, Button, Form, ProgressBar, Row, Col } from 'react-bootstrap';

const PersonalizedAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 'q1',
      text: 'How do you prefer to solve problems?',
      options: [
        { id: 'a', text: 'Analyze data and find patterns' },
        { id: 'b', text: 'Collaborate with others to brainstorm solutions' },
        { id: 'c', text: 'Follow established procedures and methodologies' },
        { id: 'd', text: 'Think creatively and try unconventional approaches' }
      ]
    },
    {
      id: 'q2',
      text: 'In a team setting, which role do you naturally take on?',
      options: [
        { id: 'a', text: 'The leader who directs the team' },
        { id: 'b', text: 'The creative who generates ideas' },
        { id: 'c', text: 'The analyst who evaluates options' },
        { id: 'd', text: 'The supporter who helps others succeed' }
      ]
    },
    {
      id: 'q3',
      text: 'Which work environment do you thrive in?',
      options: [
        { id: 'a', text: 'Structured with clear guidelines' },
        { id: 'b', text: 'Flexible with room for creativity' },
        { id: 'c', text: 'Collaborative with frequent team interaction' },
        { id: 'd', text: 'Independent with minimal supervision' }
      ]
    }
  ];

  const handleAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setCompleted(false);
  };

  const renderQuestion = () => {
    const question = questions[currentStep];
    return (
      <div>
        <h4 className="mb-4">{question.text}</h4>
        <Form>
          {question.options.map(option => (
            <Form.Check
              key={option.id}
              type="radio"
              id={`${question.id}-${option.id}`}
              label={option.text}
              name={question.id}
              className="mb-3 assessment-option"
              checked={answers[question.id] === option.id}
              onChange={() => handleAnswer(question.id, option.id)}
            />
          ))}
        </Form>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
        </div>
        <h3 className="mb-3">Assessment Complete!</h3>
        <p className="lead mb-4">Based on your responses, we've identified your top career matches:</p>
        
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">Software Development</h4>
                  <span className="badge bg-primary px-3 py-2">92% Match</span>
                </div>
                <ProgressBar variant="success" now={92} className="mb-3" style={{height: '8px'}} />
                <p className="text-muted">Your analytical approach to problem-solving and preference for creative solutions makes software development an excellent match.</p>
              </Card.Body>
            </Card>
            
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">UX/UI Design</h4>
                  <span className="badge bg-primary px-3 py-2">85% Match</span>
                </div>
                <ProgressBar variant="success" now={85} className="mb-3" style={{height: '8px'}} />
                <p className="text-muted">Your creative thinking and preference for flexible environments align well with a career in UX/UI design.</p>
              </Card.Body>
            </Card>
            
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">Data Analysis</h4>
                  <span className="badge bg-primary px-3 py-2">78% Match</span>
                </div>
                <ProgressBar variant="success" now={78} className="mb-3" style={{height: '8px'}} />
                <p className="text-muted">Your analytical mindset and structured approach to problem-solving indicate potential success in data analysis.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <div>
          <Button variant="primary" className="me-3">
            Explore These Careers
          </Button>
          <Button variant="outline-secondary" onClick={handleReset}>
            Retake Assessment
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div id="assessment" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary mb-3">Personalized Career Assessment</h2>
          <p className="lead">Discover your ideal career path with our AI-powered assessment</p>
        </div>

        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4 p-md-5">
            {!completed ? (
              <>
                <div className="mb-4">
                  <ProgressBar 
                    now={(currentStep / questions.length) * 100} 
                    variant="primary" 
                    className="mb-3"
                    style={{height: '8px'}}
                  />
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Question {currentStep + 1} of {questions.length}</small>
                    <small className="text-muted">{Math.round((currentStep / questions.length) * 100)}% Complete</small>
                  </div>
                </div>
                
                {renderQuestion()}
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleNext}
                    disabled={!answers[questions[currentStep].id]}
                  >
                    {currentStep === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                  </Button>
                </div>
              </>
            ) : (
              renderResults()
            )}
          </Card.Body>
        </Card>
      </div>
      
      <style jsx>{`
        .assessment-option {
          padding: 12px 16px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .assessment-option:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default PersonalizedAssessment;