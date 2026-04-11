import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../utils/token';

// ─── Styled Components ───────────────────────────────────────────

const AppShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.aside`
  width: 240px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: 24px 20px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const LogoText = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1.2;
  }
  p {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? '#fff' : theme.colors.sidebarText};
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryHover : theme.colors.background};
  }

  span {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled.div`
  padding: 16px 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    background: #FEF2F2;
    color: ${({ theme }) => theme.colors.danger};
  }

  span { font-size: 18px; }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  padding: 40px 48px;
  max-width: calc(100% - 240px);
`;

// ─── Component ────────────────────────────────────────────────────

const navItems = [
  { label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { label: 'Book Appointment', icon: '📅', path: '/book' },
  { label: 'Appointment History', icon: '📋', path: '/appointments' },
  { label: 'Profile', icon: '👤', path: '/profile' },
];

export function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <AppShell>
      <Sidebar>
        <SidebarHeader>
          <Logo>
            <LogoIcon>⚕️</LogoIcon>
            <LogoText>
              <h2>QuickClinic</h2>
              <p>Student Portal</p>
            </LogoText>
          </Logo>
        </SidebarHeader>

        <Nav>
          {navItems.map(({ label, icon, path }) => (
            <NavItem
              key={path}
              $active={location.pathname === path}
              onClick={() => navigate(path)}
            >
              <span>{icon}</span>
              {label}
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <LogoutButton onClick={handleLogout}>
            <span>🚪</span>
            Logout
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>{children}</MainContent>
    </AppShell>
  );
}
