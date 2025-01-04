import { BodyPart } from './types';

export const BODY_PARTS: BodyPart[] = [
  {
    id: 'head',
    name: 'Head & Face',
    commonSymptoms: ['Headache', 'Migraine', 'Dizziness', 'Vision changes', 'Facial pain'],
    coordinates: { x: 50, y: 20, radius: 12 },
    regions: ['1', '2', '23', '24']
  },
  {
    id: 'neck',
    name: 'Neck & Throat',
    commonSymptoms: ['Sore throat', 'Stiff neck', 'Swollen glands', 'Difficulty swallowing'],
    coordinates: { x: 50, y: 35, radius: 8 },
    regions: ['3', '25']
  },
  // ... other body parts
]; 