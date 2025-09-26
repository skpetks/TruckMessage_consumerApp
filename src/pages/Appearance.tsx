import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Feather'
import { useAppDispatch } from '../store/hooks'
import { saveThemeToStorage } from '../store/slice/themeSlice'
import { useTheme } from '../hooks/useTheme'

const Appearance = () => {
  const dispatch = useAppDispatch();
  const { isDark, theme } = useTheme();
  
  const toggleTheme = () => {
    dispatch(saveThemeToStorage(!isDark));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.header}>
          <Icon 
            name={isDark ? 'moon' : 'sun'} 
            size={24} 
            color={theme.iconPrimary} 
          />
          <Text style={[styles.headerText, { color: theme.textPrimary }]}>
            Theme Appearance
          </Text>
        </View>
        
        <View style={[styles.themeOption, { borderBottomColor: theme.border }]}>
          <View style={styles.themeInfo}>
            <View style={styles.iconContainer}>
              <Icon 
                name="palette" 
                size={20} 
                color={theme.iconPrimary} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>
                Dark Theme
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                Switch to dark mode for better visibility in low light
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ 
              false: theme.backgroundGray, 
              true: theme.primary 
            }}
            thumbColor={isDark ? theme.primaryLight : theme.borderGray}
            ios_backgroundColor={theme.backgroundGray}
          />
        </View>

        <View style={styles.themePreview}>
          <Text style={[styles.previewTitle, { color: theme.textPrimary }]}>
            Preview
          </Text>
          <View style={[styles.previewContainer, { backgroundColor: theme.backgroundLight }]}>
            <View style={[styles.previewCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.previewHeader}>
                <View style={[styles.previewAvatar, { backgroundColor: theme.primary }]} />
                <Text style={[styles.previewText, { color: theme.textPrimary }]}>
                  Sample Content
                </Text>
              </View>
              <Text style={[styles.previewDescription, { color: theme.textSecondary }]}>
                This is how your app will look in {isDark ? 'dark' : 'light'} mode.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Appearance

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  themePreview: {
    marginTop: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewContainer: {
    borderRadius: 8,
    padding: 12,
  },
  previewCard: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
})