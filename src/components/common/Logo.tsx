import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

interface LogoContainerProps {
  $isRTL: boolean;
}

const LogoContainer = styled.View<LogoContainerProps>`
  flex-direction: ${(props: LogoContainerProps) => props.$isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  margin-bottom: 16px;
`;

interface LogoSymbolProps {
  $isRTL: boolean;
}

const LogoSymbol = styled.View<LogoSymbolProps>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #3b82f6;
  justify-content: center;
  align-items: center;
  margin: ${(props: LogoSymbolProps) => props.$isRTL ? '0 0 0 12px' : '0 12px 0 0'};
`;

const LogoText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
`;

interface HebrewTextProps {
  $isRTL: boolean;
}

const HebrewText = styled.Text<HebrewTextProps>`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: ${(props: HebrewTextProps) => props.$isRTL ? '0 12px 0 0' : '0 0 0 12px'};
`;

const Circle = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: white;
  transform: rotate(45deg);
`;

interface Props {
  language: 'en' | 'he';
}

export function Logo({ language }: Props) {
  const isRTL = language === 'he';

  return (
    <LogoContainer $isRTL={isRTL}>
      <LogoSymbol $isRTL={isRTL}>
        <Circle />
      </LogoSymbol>
      <LogoText>Lirkod</LogoText>
      <HebrewText $isRTL={isRTL}>לרקוד</HebrewText>
    </LogoContainer>
  );
} 