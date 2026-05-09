import React from 'react';
import styled from 'styled-components';
import { getUserFromToken } from '../../shared/utils/token';

// ─── Styled Components ───────────────────────────────────────────

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 28px;
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  margin-bottom: 16px;
  max-width: 680px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
`;

const AvatarInfo = styled.div`
  h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 2px;
  }
  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 18px;

  &:last-child { border-bottom: none; }
`;

const InfoContent = styled.div`
  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 2px;
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const MedicalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
`;

const MedicalItem = styled.div`
  padding: 10px 0;
  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 3px;
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  max-width: 680px;
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 15px;
  font-weight: 600;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 15px;
  font-weight: 500;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: #94A3B8;
  }
`;

// ─── Component ────────────────────────────────────────────────────

export function Profile() {
  const user = getUserFromToken();

  return (
    <div>
      <PageTitle>My Profile</PageTitle>
      <PageSubtitle>Manage your personal information</PageSubtitle>

      <Section>
        <AvatarRow>
          <Avatar>👤</Avatar>
          <AvatarInfo>
            <h2>{user?.name || 'Student'}</h2>
            <p>Email: {user?.email || 'N/A'}</p>
          </AvatarInfo>
        </AvatarRow>
      </Section>

      <Section>
        <SectionTitle>Personal Information</SectionTitle>
        <InfoItem>
          📧
          <InfoContent>
            <label>Email</label>
            <p>{user?.email || 'Not provided'}</p>
          </InfoContent>
        </InfoItem>
        <InfoItem>
          📱
          <InfoContent>
            <label>Phone</label>
            <p>+1 (555) 123-4567</p>
          </InfoContent>
        </InfoItem>
        <InfoItem>
          📅
          <InfoContent>
            <label>Member Since</label>
            <p>January 15, 2024</p>
          </InfoContent>
        </InfoItem>
      </Section>

      <Section>
        <SectionTitle>Medical Information</SectionTitle>
        <MedicalGrid>
          <MedicalItem>
            <label>Blood Type</label>
            <p>Not provided</p>
          </MedicalItem>
          <MedicalItem>
            <label>Allergies</label>
            <p>None reported</p>
          </MedicalItem>
          <MedicalItem style={{ gridColumn: '1 / -1' }}>
            <label>Emergency Contact</label>
            <p>Parent/Guardian - +1 (555) 987-6543</p>
          </MedicalItem>
        </MedicalGrid>
      </Section>

      <ButtonRow>
        <PrimaryButton disabled>Edit Profile</PrimaryButton>
        <SecondaryButton disabled>Change Password</SecondaryButton>
      </ButtonRow>
    </div>
  );
}
