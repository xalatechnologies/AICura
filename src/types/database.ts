export interface Profile {
  id: string;
  onboarding_completed: boolean;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  medical_conditions: string[];
  allergies: string[];
  medications: string[];
  preferred_language: string;
  theme: 'light' | 'dark';
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_type: string;
  last_physical_date: string;
  lifestyle_factors: {
    smoking: boolean;
    alcohol: boolean;
    exercise_frequency: 'none' | 'occasional' | 'regular' | 'frequent';
    diet_restrictions: string[];
  };
  communication_preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
    appointment_reminders: boolean;
    newsletter: boolean;
  };
  updated_at: string;
} 