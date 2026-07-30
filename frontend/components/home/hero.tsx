import Image from "next/image";
import SearchBar from "@/components/home/search-bar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[380px] sm:h-[460px]">
        <Image
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?fm=jpg&q=80&w=2000&auto=format&fit=crop"
          alt="The Taj Mahal, India"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <div className="container-page relative -mt-16 pb-10 sm:-mt-20">
        <SearchBar />
      </div>
    </section>
  );
}
