import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../lib/supabase';
import { changeLanguage } from '../i18n';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export const LanguageToggle = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = async (language: Language) => {
    try {
      await changeLanguage(language.code);

      // Save to Supabase if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            language: language.code,
            updated_at: new Date().toISOString(),
          });
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.card }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.content}>
          <Icon name="language-outline" size={24} color={colors.text} />
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('profile.language')}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {getCurrentLanguage().name}
            </Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={24} color={colors.text} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('profile.language')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor:
                      language.code === i18n.language
                        ? colors.primary + '20'
                        : 'transparent',
                  },
                ]}
                onPress={() => handleLanguageChange(language)}
              >
                <Text style={[styles.languageName, { color: colors.text }]}>
                  {language.name}
                </Text>
                <Text style={[styles.nativeName, { color: colors.text }]}>
                  {language.nativeName}
                </Text>
                {language.code === i18n.language && (
                  <Icon
                    name="checkmark"
                    size={24}
                    color={colors.primary}
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  languageOption: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  nativeName: {
    fontSize: 14,
    opacity: 0.6,
    marginLeft: 8,
  },
  checkmark: {
    marginLeft: 8,
  },
}); 