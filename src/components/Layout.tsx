import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('ownthegym_token');

  return (
    <>
      <Outlet />
      {isAuthenticated && <Footer />}
    </>
  );
};
