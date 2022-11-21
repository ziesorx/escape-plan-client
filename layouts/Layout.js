/* eslint-disable react-hooks/exhaustive-deps */
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/* eslint-disable @next/next/no-img-element */
const Layout = ({ children }) => {
  const { user } = useSelector(state => state.user);

  const router = useRouter();

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      if (
        router.pathname.includes('main-menu') ||
        router.pathname.includes('waiting') ||
        router.pathname.includes('game-time')
      ) {
        Router.push('auth');
      }
    }
  }, []);

  return (
    <div
      className="w-100 vh-100 d-inline-flex flex-column justify-content-center"
      style={{
        backgroundImage: 'url("/img/city-bg.gif")',
        backgroundSize: 'cover',
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
