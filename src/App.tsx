import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { ReviewPage } from './pages/ReviewPage';
import { BuyersGuidePage } from './pages/BuyersGuidePage';
import { ComparePage } from './pages/ComparePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { OwnerStoriesPage } from './pages/OwnerStoriesPage';
import { ToolsPage } from './pages/ToolsPage';
import { IndustryPage } from './pages/IndustryPage';
import { EventsPage } from './pages/EventsPage';
import { BrandsPage } from './pages/BrandsPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { BasicsPage } from './pages/BasicsPage';
import { MagazinePage } from './pages/MagazinePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdvertisePage } from './pages/AdvertisePage';
import { ContributePage } from './pages/ContributePage';
import { SearchPage } from './pages/SearchPage';
import { SubscribePage } from './pages/SubscribePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SectionPage } from './pages/SectionPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div id="top" className="min-h-screen flex flex-col bg-canvas">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Article detail */}
            <Route path="/article/:slug" element={<ArticlePage />} />

            {/* Vehicle detail */}
            <Route path="/vehicles/:slug" element={<VehicleDetailPage />} />

            {/* Reviews */}
            <Route path="/consumers/reviews" element={<ReviewsPage />} />
            <Route path="/reviews/:slug" element={<ReviewPage />} />

            {/* Consumers */}
            <Route path="/consumers/buyers-guide" element={<BuyersGuidePage />} />
            <Route path="/consumers/compare" element={<ComparePage />} />
            <Route path="/consumers/tools/cost-savings" element={<ToolsPage />} />
            <Route path="/consumers/tools/charger-map" element={<ToolsPage />} />
            <Route path="/consumers/tools/subsidy" element={<ToolsPage />} />
            <Route path="/consumers/owner-stories" element={<OwnerStoriesPage />} />
            <Route path="/consumers/community/ask" element={<OwnerStoriesPage />} />

            {/* Industry */}
            <Route path="/industry" element={<IndustryPage />} />
            <Route path="/industry/reports" element={<SectionPage pathKey="/industry/reports" />} />
            <Route path="/industry/oem-tracker" element={<SectionPage pathKey="/industry/oem-tracker" />} />
            <Route path="/industry/battery-tech" element={<SectionPage pathKey="/industry/battery-tech" />} />
            <Route path="/industry/charging-infra" element={<SectionPage pathKey="/industry/charging-infra" />} />
            <Route path="/industry/interviews" element={<SectionPage pathKey="/industry/interviews" />} />
            <Route path="/industry/expert-opinions" element={<SectionPage pathKey="/industry/expert-opinions" />} />
            <Route path="/industry/investment" element={<SectionPage pathKey="/industry/investment" />} />

            {/* Events */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/calendar" element={<EventsPage />} />
            <Route path="/events/expos" element={<SectionPage pathKey="/events/expos" />} />
            <Route path="/events/conferences" element={<SectionPage pathKey="/events/conferences" />} />
            <Route path="/events/webinars" element={<SectionPage pathKey="/events/webinars" />} />
            <Route path="/events/recaps" element={<SectionPage pathKey="/events/recaps" />} />

            {/* Brands */}
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/brands/:slug" element={<BrandDetailPage />} />

            {/* EV Basics */}
            <Route path="/basics" element={<BasicsPage />} />
            <Route path="/basics/how-ev-works" element={<SectionPage pathKey="/news" />} />
            <Route path="/basics/battery-types" element={<SectionPage pathKey="/industry/battery-tech" />} />
            <Route path="/basics/charging-guide" element={<SectionPage pathKey="/industry/charging-infra" />} />
            <Route path="/basics/glossary" element={<BasicsPage />} />
            <Route path="/basics/myths" element={<BasicsPage />} />

            {/* Magazine */}
            <Route path="/magazine/current" element={<MagazinePage />} />
            <Route path="/magazine/archive" element={<SectionPage pathKey="/magazine/archive" />} />
            <Route path="/magazine/long-reads" element={<SectionPage pathKey="/magazine/long-reads" />} />
            <Route path="/magazine/editors-picks" element={<SectionPage pathKey="/magazine/editors-picks" />} />

            {/* Utility pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/team" element={<AboutPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/newsletter" element={<SubscribePage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* News */}
            <Route path="/news" element={<SectionPage pathKey="/news" />} />

            {/* Legal */}
            <Route path="/legal" element={<AboutPage />} />
            <Route path="/legal/privacy" element={<AboutPage />} />
            <Route path="/legal/terms" element={<AboutPage />} />
            <Route path="/legal/cookies" element={<AboutPage />} />
            <Route path="/legal/disclaimer" element={<AboutPage />} />

            {/* Misc */}
            <Route path="/careers" element={<NotFoundPage />} />
            <Route path="/rss" element={<NotFoundPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
