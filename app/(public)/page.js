import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import Categories from "@/components/home/categories";
import WhyChooseUs from "@/components/home/why-choose-us";
import FeaturedServices from "@/components/home/featured-services";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
    </>
  );
}