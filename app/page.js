import Image from "next/image";
import Landing from "./components/Landing";
import Schedule from "./components/Schedule";
import FAQ from "./components/FAQ";
import About from "./components/About";
import SpiralToLines from "./components/MorphingSpiral";

export default function Home() {
  return (
    <div>
      <Landing />
      <About />
      <Schedule />
      <FAQ />
    </div>
  );
}
