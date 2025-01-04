import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  SymptomAnalyzer: {
    initialSymptom?: string;
  };
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  LanguageSelection: undefined;
  Welcome: undefined;
  Splash: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
