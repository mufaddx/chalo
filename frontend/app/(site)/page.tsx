import Hero from "@/components/home/hero";
import Categories from "@/components/home/categories";
import TourRail from "@/components/home/tour-rail";
import Destinations from "@/components/home/destinations";
import TopAgencies from "@/components/home/top-agencies";
import WhyChooseUs from "@/components/home/why-choose-us";
import Testimonials from "@/components/home/testimonials";
import BlogPreview from "@/components/home/blog-preview";
import Faq from "@/components/home/faq";
import Newsletter from "@/components/home/newsletter";
import InstagramGallery from "@/components/home/instagram-gallery";
import { lastMinuteDeals } from "@/lib/data";
import { getHomeData } from "@/lib/api/get-home-data";
import { DemoDataBanner, LiveDataBanner } from "@/components/dashboard/data-source-banner";

export default async function Home() {
  const { featured, trending, upcoming, source } = await getHomeData();

  return (
    <>
      <Hero />
      {source === "live" && (
        <div className="container-page pt-6">
          <LiveDataBanner />
        </div>
      )}
      {source === "demo" && (
        <div className="container-page pt-6">
          <DemoDataBanner reason="offline" />
        </div>
      )}
      <Categories />
      <TourRail
        eyebrow="Handpicked this month"
        title="Featured tours"
        description="Reviewed by our team for genuine value, not just a paid placement."
        tours={featured}
      />
      <Destinations />
      <TourRail
        eyebrow="Booked the most this week"
        title="Trending tours"
        tours={trending}
        tone="dark"
      />
      <TourRail
        eyebrow="Seats filling fast"
        title="Last-minute deals"
        description="Departing within the next 3 weeks — agencies price these to fill the last few seats."
        tours={lastMinuteDeals}
      />
      <TopAgencies />
      <WhyChooseUs />
      <TourRail
        eyebrow="Plan ahead"
        title="Upcoming tours"
        tours={upcoming}
      />
      <Testimonials />
      <BlogPreview />
      <Faq />
      <Newsletter />
      <InstagramGallery />
    </>
  );
}
