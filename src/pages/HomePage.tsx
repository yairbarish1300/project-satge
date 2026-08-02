import { useState } from 'react';
import Header from '../components/Header';
import { SimpleFooter } from '../components/PageFooters';
import HeroSection from '../components/home/HeroSection';
import ServicesGrid from '../components/home/ServicesGrid';
import './HomePage.css';

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="rp-page">
      <Header currentPage="home" showSearch={true} searchValue={searchInput} onSearchChange={setSearchInput} />

      <main className="rp-main home-page">
        <HeroSection />
        <ServicesGrid />

        <SimpleFooter
          copyright="© 2024 STAGE Event Production Services"
          links={[
            { label: 'Home', href: '#' },
            { label: 'Shop', href: '#' },
            { label: 'Rentals', href: '#' },
            { label: 'Privacy Policy', href: '#' },
          ]}
        />
      </main>
    </div>
  );
}
