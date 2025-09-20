import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { getQuizResults } from '../services/api';

const QuizResults = ({ route, navigation }) => {
  const { resultId } = route.params || {};
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const data = await getQuizResults(resultId);
      setResults(data);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      Alert.alert(t('common.error'), t('quizResults.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!results) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('quizResults.noResults')}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchResults}
        >
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('quizResults.yourResults')}</Text>
        <Text style={styles.subtitle}>{t('quizResults.careerInsights')}</Text>
      </View>

      <View style={styles.resultSummary}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryTitle}>{t('quizResults.careerMatch')}</Text>
          <Text style={styles.careerMatch}>{results.topCareer}</Text>
          <Text style={styles.matchDescription}>{results.careerDescription}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quizResults.yourStrengths')}</Text>
        <View style={styles.strengthsList}>
          {results.strengths.map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <View style={styles.strengthIconContainer}>
                <Image 
                  source={require('../assets/icons/strength.svg')} 
                  style={styles.strengthIcon}
                />
              </View>
              <View style={styles.strengthContent}>
                <Text style={styles.strengthTitle}>{strength.title}</Text>
                <Text style={styles.strengthDescription}>{strength.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quizResults.areasToImprove')}</Text>
        <View style={styles.improvementsList}>
          {results.improvements.map((improvement, index) => (
            <View key={index} style={styles.improvementItem}>
              <View style={styles.improvementIconContainer}>
                <Image 
                  source={require('../assets/icons/improvement.svg')} 
                  style={styles.improvementIcon}
                />
              </View>
              <View style={styles.improvementContent}>
                <Text style={styles.improvementTitle}>{improvement.title}</Text>
                <Text style={styles.improvementDescription}>{improvement.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quizResults.recommendedCareers')}</Text>
        <View style={styles.careersList}>
          {results.recommendedCareers.map((career, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.careerCard}
              onPress={() => navigation.navigate('CareerDetail', { career })}
            >
              <Text style={styles.careerTitle}>{career.title}</Text>
              <Text style={styles.careerMatch}>{career.matchPercentage}% {t('quizResults.match')}</Text>
              <Text style={styles.careerDescription}>{career.description}</Text>
              <View style={styles.careerFooter}>
                <Text style={styles.careerSalary}>{career.averageSalary}</Text>
                <Text style={styles.careerGrowth}>{career.growthRate} {t('quizResults.growth')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quizResults.recommendedCourses')}</Text>
        <View style={styles.coursesList}>
          {results.recommendedCourses.map((course, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.courseCard}
              onPress={() => navigation.navigate('CourseDetail', { course })}
            >
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseProvider}>{course.provider}</Text>
              <Text style={styles.courseDescription}>{course.description}</Text>
              <View style={styles.courseFooter}>
                <Text style={styles.courseDuration}>{course.duration}</Text>
                <View style={styles.courseButton}>
                  <Text style={styles.courseButtonText}>{t('quizResults.learnMore')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.actionButtonText}>{t('quizResults.retakeQuiz')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.primaryButtonText}>{t('quizResults.backToDashboard')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4285F4',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#4285F4',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  resultSummary: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: -20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  careerMatch: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 10,
  },
  matchDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  strengthsList: {
    marginBottom: 10,
  },
  strengthItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  strengthIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  strengthIcon: {
    width: 20,
    height: 20,
    tintColor: '#4285F4',
  },
  strengthContent: {
    flex: 1,
  },
  strengthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  strengthDescription: {
    fontSize: 14,
    color: '#666',
  },
  improvementsList: {
    marginBottom: 10,
  },
  improvementItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  improvementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff0e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  improvementIcon: {
    width: 20,
    height: 20,
    tintColor: '#FF8C42',
  },
  improvementContent: {
    flex: 1,
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  improvementDescription: {
    fontSize: 14,
    color: '#666',
  },
  careersList: {
    marginBottom: 10,
  },
  careerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  careerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  careerMatch: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 10,
  },
  careerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  careerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  careerSalary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  careerGrowth: {
    fontSize: 14,
    color: '#666',
  },
  coursesList: {
    marginBottom: 10,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  courseProvider: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseDuration: {
    fontSize: 14,
    color: '#666',
  },
  courseButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f7ff',
    borderRadius: 15,
  },
  courseButtonText: {
    fontSize: 12,
    color: '#4285F4',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 0,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4285F4',
    marginRight: 0,
    marginLeft: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});

export default QuizResults;