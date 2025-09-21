import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { fetchColleges } from '../services/api';
import CollegeCard from '../components/CollegeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/Layout';
import VoiceChatbot from '../components/VoiceChatbot';

export default function Colleges() {
  const { t } = useTranslation();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    loadColleges();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [colleges, searchTerm, selectedDistrict]);

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchColleges();
      setColleges(data);
    } catch (err) {
      console.error('Error loading colleges:', err);
      setError('Failed to load colleges. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterColleges = () => {
    let filtered = colleges;

    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(college =>
        college.district.toLowerCase() === selectedDistrict.toLowerCase()
      );
    }

    setFilteredColleges(filtered);
  };

  const districts = [...new Set(colleges.map(college => college.district))];

  if (loading) {
    return (
      <Layout title={t('colleges.title')}>
        <LoadingSpinner text="Loading colleges..." />
      </Layout>
    );
  }

  return (
    <Layout title={t('colleges.title')}>
      <Head>
        <title>{t('colleges.title')} | Digital Career Advisor</title>
        <meta name="description" content="Explore colleges and universities for J&K students" />
      </Head>

      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="display-5 fw-bold text-primary mb-3">
              {t('colleges.title')}
            </h1>
            <p className="lead text-muted">
              Discover the best colleges and universities for your educational journey
            </p>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('colleges.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">{t('colleges.allDistricts')}</option>
              {districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Results Count */}
        <Row className="mb-3">
          <Col>
            <p className="text-muted">
              {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''} found
            </p>
          </Col>
        </Row>

        {/* Colleges Grid */}
        {filteredColleges.length > 0 ? (
          <Row>
            {filteredColleges.map(college => (
              <Col key={college.id} lg={4} md={6} className="mb-4">
                <CollegeCard college={college} />
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            <Col>
              <Card className="text-center py-5">
                <Card.Body>
                  <i className="bi bi-search display-1 text-muted mb-3"></i>
                  <h4 className="text-muted">No colleges found</h4>
                  <p className="text-muted">
                    Try adjusting your search criteria or browse all colleges.
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDistrict('');
                    }}
                  >
                    Clear Filters
                  </button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      
      {/* Voice Chatbot */}
      <VoiceChatbot />
    </Layout>
  );
}