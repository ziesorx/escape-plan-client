import { useEffect } from 'react';
import Router from 'next/router';

const Index = () => {
  useEffect(() => {
    Router.push('/auth');
  });

  return <div />;
};

export default Index;
