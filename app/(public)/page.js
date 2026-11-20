import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import Categories from "@/components/home/categories";
import WhyChooseUs from "@/components/home/why-choose-us";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Featured Services section ekhane boshbe (server API banano por) */}
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
    </>
  );
}