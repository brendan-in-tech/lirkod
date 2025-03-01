import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useSupabaseDances } from '../../hooks/useSupabaseDances';

interface SidebarProps {
  language: 'en' | 'he';
  onLanguageToggle: () => void;
}

const Container = styled.View`
  width: 250px;
  background-color: #fff;
  border-right-width: 1px;
  border-right-color: #e5e7eb;
  padding: 20px;
`;

const LogoContainer = styled.View`
  margin-bottom: 20px;
`;

const Logo = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
`;

const HebrewText = styled.Text`
  font-size: 18px;
  color: #4b5563;
  margin-top: 4px;
`;

const LanguageToggle = styled.TouchableOpacity`
  padding: 8px;
  background-color: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const LanguageText = styled.Text`
  font-size: 16px;
  color: #4b5563;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-top: 24px;
  margin-bottom: 8px;
`;

const MenuItem = styled(TouchableOpacity)<{ isActive?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
  opacity: ${props => props.isActive ? 1 : 0.7};
`;

const MenuText = styled.Text<{ isActive?: boolean }>`
  margin-left: 12px;
  font-size: 14px;
  color: ${props => props.isActive ? '#3b82f6' : '#4b5563'};
  font-weight: ${props => props.isActive ? '600' : '400'};
`;

interface MenuItemData {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  screen?: keyof RootStackParamList;
  params?: any;
}

export function Sidebar({ language, onLanguageToggle }: SidebarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeItem, setActiveItem] = React.useState('Home');
  const { choreographers, performers, shapes, isLoading, error } = useSupabaseDances(language);

  const menuItems: Record<string, MenuItemData[]> = {
    Menu: [
      { icon: 'home', label: 'Home', screen: 'Home' },
      { icon: 'search', label: 'Search', screen: 'Search' },
      { icon: 'explore', label: 'Discover', screen: 'Discover' },
    ],
    Categories: [
      { 
        icon: 'people', 
        label: 'Choreographers', 
        screen: 'Choreographers',
        params: { choreographers }
      },
      { 
        icon: 'person', 
        label: 'Artists', 
        screen: 'Artists',
        params: { performers }
      },
      { 
        icon: 'category', 
        label: 'Shapes', 
        screen: 'Shapes',
        params: { shapes }
      },
    ],
    Library: [
      { icon: 'history', label: 'Recent' },
      { icon: 'favorite', label: 'Favourites' },
    ],
    Playlist: [
      { icon: 'add', label: 'Create New' },
      { icon: 'queue-music', label: 'My Playlists' },
    ],
    General: [
      { icon: 'settings', label: 'Settings', screen: 'Settings' },
      { icon: 'logout', label: 'Log Out' },
    ],
  };

  const handlePress = (item: MenuItemData) => {
    if (item.screen) {
      setActiveItem(item.label);
      navigation.navigate(item.screen, item.params);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LogoContainer>
          <Logo>Lirkod</Logo>
          <HebrewText>לרקוד</HebrewText>
        </LogoContainer>
        <ActivityIndicator size="large" color="#3b82f6" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <LogoContainer>
          <Logo>Lirkod</Logo>
          <HebrewText>לרקוד</HebrewText>
        </LogoContainer>
        <Text style={{ color: 'red' }}>{error}</Text>
      </Container>
    );
  }

  return (
    <Container>
      <LogoContainer>
        <Logo>Lirkod</Logo>
        <HebrewText>לרקוד</HebrewText>
      </LogoContainer>
      <LanguageToggle onPress={onLanguageToggle}>
        <LanguageText>{language === 'en' ? 'עברית' : 'English'}</LanguageText>
      </LanguageToggle>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(menuItems).map(([section, items]) => (
          <View key={section}>
            <SectionTitle>{section}</SectionTitle>
            {items.map((item) => (
              <MenuItem
                key={item.label}
                isActive={activeItem === item.label}
                onPress={() => handlePress(item)}
              >
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={activeItem === item.label ? '#3b82f6' : '#4b5563'}
                />
                <MenuText isActive={activeItem === item.label}>
                  {item.label}
                </MenuText>
              </MenuItem>
            ))}
          </View>
        ))}
      </ScrollView>
    </Container>
  );
} 