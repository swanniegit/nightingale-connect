import { Question } from '../types';

export const mockQuestions: Question[] = [
  {
    id: 1,
    title: 'Hypertension management in rural settings',
    content: 'What are the best practices for managing hypertension in patients with limited access to specialists? I\'m working in a remote clinic in Limpopo.',
    author: 'Dr. Sarah Johnson',
    specialty: 'Rural Health',
    province: 'Limpopo',
    votes: 12,
    responses: 3,
    tags: ['hypertension', 'rural', 'chronic-care'],
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    title: 'POPIA compliance for patient records',
    content: 'How do we ensure POPIA compliance when sharing patient information for consultations?',
    author: 'NP Maria Van Der Merwe',
    specialty: 'Primary Care',
    province: 'Western Cape',
    votes: 8,
    responses: 1,
    tags: ['popia', 'compliance', 'telemedicine'],
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    title: 'Pediatric vaccination schedules post-COVID',
    content: 'Have there been any updates to childhood vaccination schedules following COVID-19?',
    author: 'Sister Jane Mthembu',
    specialty: 'Pediatric Care',
    province: 'KwaZulu-Natal',
    votes: 15,
    responses: 7,
    tags: ['pediatric', 'vaccination', 'covid-19'],
    timestamp: '1 day ago'
  },
  {
    id: 4,
    title: 'Mental health resources in townships',
    content: 'What mental health resources are available for patients in township areas?',
    author: 'NP Thabo Mokoena',
    specialty: 'Mental Health',
    province: 'Gauteng',
    votes: 20,
    responses: 12,
    tags: ['mental-health', 'township', 'depression'],
    timestamp: '2 days ago'
  },
  {
    id: 5,
    title: 'Diabetes management without glucometer strips',
    content: 'How can we effectively manage diabetic patients when glucometer strips are in short supply?',
    author: 'Dr. Nomsa Dlamini',
    specialty: 'Endocrinology',
    province: 'Mpumalanga',
    votes: 18,
    responses: 9,
    tags: ['diabetes', 'resource-constraints', 'monitoring'],
    timestamp: '3 days ago'
  }
]; 