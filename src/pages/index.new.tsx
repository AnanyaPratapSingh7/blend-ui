import { useRouter } from 'next/router';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to markets page
    router.replace('/markets');
  }, [router]);

  return null;
};

export default HomePage;
