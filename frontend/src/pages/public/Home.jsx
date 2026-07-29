import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroSection   from '../../components/home/HeroSection';
import StatsCounter  from '../../components/home/StatsCounter';
import FeaturedItems from '../../components/home/FeaturedItems';
import HowItWorks    from '../../components/home/HowItWorks';
import Testimonials  from '../../components/home/Testimonials';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home-page">
        <HeroSection />
        <StatsCounter />
        <FeaturedItems />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
