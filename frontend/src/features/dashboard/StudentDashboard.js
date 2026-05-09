import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getAppointmentHistory } from '../appointment/appointmentApi';
import { getUserFromToken as getUserFromTokenUtil} from '../../shared/utils/token';


// ─── Styled Components ───────────────────────────────────────────

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const WelcomeBanner = styled.div`
  background: #EEF2FF;
  border: 1px solid #C7D2FE;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
  position: relative;
`;

const BannerIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #C7D2FE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const BannerContent = styled.div`
  flex: 1;
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 4px;
  }
  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 8px;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.textSecondary};
      padding: 2px 0;
      &::before { content: "• "; }
    }
  }
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.textSecondary}; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  border-left: ${({ $accent }) => $accent ? `4px solid ${$accent}` : 'none'};
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const CardSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 14px;
`;

const AppointmentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  svg { color: ${({ theme }) => theme.colors.primary}; }
`;

const NoteBox = styled.div`
  background: #EFF6FF;
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
  margin-top: 12px;
  font-size: 13px;
  color: #1E40AF;
`;

const InfoRow = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  strong { color: ${({ theme }) => theme.colors.textPrimary}; }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.15s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const ActionIconWrap = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ $bg }) => $bg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

const ActionLabel = styled.div`
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 2px;
  }
  p {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const RecentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RecentCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 16px 20px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: ${({ theme }) => theme.shadows.md}; }
`;

// ─── Component ────────────────────────────────────────────────────

export function StudentDashboard() {
  const navigate = useNavigate();
  const [bannerVisible, setBannerVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const userData = getUserFromTokenUtil();
    setUser(userData);
    
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await getAppointmentHistory();
      setAppointments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const upcomingAppointment = appointments.find(
    apt => apt.status === 'APPROVED'
  );

  const pendingAppointment = appointments.find(
    apt => apt.status === 'PENDING'
  );

  return (
    <div>
      <PageTitle>Welcome back, {user?.name || 'Student'}!</PageTitle>
      <PageSubtitle>Here's your health overview</PageSubtitle>

      {bannerVisible && (
        <WelcomeBanner>
          <BannerIcon>ℹ️</BannerIcon>
          <BannerContent>
            <h3>Welcome to QuickClinic</h3>
            <p>Your university health portal for easy appointment scheduling and medical care.</p>
            <ul>
              <li>Book appointments for emergency, same-day, or scheduled visits</li>
              <li>Track your appointment history and medical records</li>
              <li>Upload medical documents for your doctor to review</li>
            </ul>
          </BannerContent>
          <DismissButton onClick={() => setBannerVisible(false)}>
            ✕
          </DismissButton>
        </WelcomeBanner>
      )}

      {upcomingAppointment && (
        <Card $accent="#2563EB">
          <CardTitle>Upcoming Appointment</CardTitle>
          <CardSubtitle>Your next scheduled visit</CardSubtitle>
          <p style={{ fontWeight: 600, fontSize: 15 }}>Appointment with Doctor</p>
          <p style={{ fontSize: 13, color: '#64748B' }}>{upcomingAppointment.symptoms}</p>
          <AppointmentMeta>
            <MetaItem>
              📅
              {new Date(upcomingAppointment.preferredDate).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </MetaItem>
            <MetaItem>
              🕐
              {upcomingAppointment.timeSlot}
            </MetaItem>
          </AppointmentMeta>
        </Card>
      )}

      {pendingAppointment && (
        <Card $accent="#F59E0B">
          <CardTitle>Appointment Pending Review</CardTitle>
          <CardSubtitle>Waiting for nurse triage approval</CardSubtitle>
          <InfoRow><strong>Type:</strong> {pendingAppointment.appointmentType}</InfoRow>
          <InfoRow><strong>Symptoms:</strong> {pendingAppointment.symptoms}</InfoRow>
          <InfoRow><strong>Requested:</strong> {pendingAppointment.preferredDate} at {pendingAppointment.timeSlot}</InfoRow>
        </Card>
      )}

      <SectionTitle>Quick Actions</SectionTitle>
      <QuickActionsGrid>
        <ActionCard onClick={() => navigate('/book')}>
          <ActionIconWrap $bg="#EFF6FF" $color="#2563EB">
            📅
          </ActionIconWrap>
          <ActionLabel>
            <h3>Book New Appointment</h3>
            <p>Schedule your clinic visit</p>
          </ActionLabel>
        </ActionCard>
        <ActionCard>
          <ActionIconWrap $bg="#F5F3FF" $color="#7C3AED">
            📤
          </ActionIconWrap>
          <ActionLabel>
            <h3>Upload Document</h3>
            <p>Share medical records</p>
          </ActionLabel>
        </ActionCard>
        <ActionCard onClick={() => navigate('/appointments')}>
          <ActionIconWrap $bg="#ECFDF5" $color="#10B981">
            📄
          </ActionIconWrap>
          <ActionLabel>
            <h3>View History</h3>
            <p>Past appointments</p>
          </ActionLabel>
        </ActionCard>
      </QuickActionsGrid>

      <SectionTitle>Recent Appointments</SectionTitle>
      <RecentGrid>
        {appointments
          .slice(0, 2)
          .map(apt => (
            <RecentCard key={apt.id} onClick={() => navigate('/appointments')}>
              <InfoRow><strong>Status:</strong> {apt.status}</InfoRow>
              <InfoRow>{apt.symptoms}</InfoRow>
              <InfoRow>{apt.preferredDate} — {apt.timeSlot}</InfoRow>
            </RecentCard>
          ))}
      </RecentGrid>
    </div>
  );
}
