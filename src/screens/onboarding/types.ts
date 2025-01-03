export interface Medication {
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'asNeeded';
}

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: Medication[];
  };
  lifestyle: {
    smoking: boolean;
    alcohol: string;
    activity: string;
  };
}

export interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  icon: string;
} 