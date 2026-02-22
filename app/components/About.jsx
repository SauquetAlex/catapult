import HorizontalLines from "./Lines";
import PillBadge from "./Pill";
import PrizeCategories from "./Categories";

export default function About() {
  return (
      <section
        id="about"
        className="relative min-h-screen flex flex-col items-center justify-start bg-[#151c43] text-white pb-[50vh]"
      >
        {/* ——— About banner ——— */}
        <div className="w-full bg-gradient-to-br from-[#6be5be] to-[#4a6fa5] py-8 px-6">
          <p className="text-xl leading-relaxed text-center max-w-5xl mx-auto text-white">
            Welcome to Catapult: a 36-hour AI + ML × Entrepreneurship hackathon
            hosted by ML@Purdue. Whether you're a designer, hacker, founder, or
            researcher, Catapult is your launchpad to create, build, and share
            something extraordinary. No matter your experience level, this is your
            chance to collaborate, experiment, and make it happen. Ready to take
            the leap? Let's build something unforgettable.
          </p>
        </div>

        {/* ——— Logistics ——— */}
        <div className="relative flex flex-col items-center justify-center max-w-4xl text-center z-10 w-full mt-16">
          <div className="flex flex-row gap-6 items-center justify-center flex-wrap">
            <PillBadge text="April 3rd – 5th" width={360} height={140} />
            <PillBadge text="@ WALC" width={360} height={140} />
          </div>
          {/* <div className="mt-16 relative flex flex-col items-center justify-center text-center z-10">
            <p className="text-xl w-[80%] leading-tight">
              <b>4 – 6 people per team.</b> Guaranteed prize awarded to all valid
              submissions to be claimed at the closing ceremony!
            </p>
          </div>*/}
        </div>

        {/* ——— Categories ——— */}
        <div className="mt-41 relative flex flex-col items-center justify-center max-w-4xl text-center z-10 w-full">
          <h1 className="text-5xl -mb-17 font-semibold">Categories</h1>
          <PrizeCategories />
        </div>

        <HorizontalLines />
      </section>
    )
}
