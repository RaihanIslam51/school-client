import Image from "next/image";
import Hero from "../../components/Hero/Hero";
import Facilities from "../../components/Facilities/Facilities";
import Academics from "../../components/Academics/Academics";
import Achievements from "../../components/Achievements/Achievements";

export default function Home() {
  return (
    <div>
      <Hero />
      <Facilities />
      <Academics />
      <Achievements />
    </div>
  );
}
