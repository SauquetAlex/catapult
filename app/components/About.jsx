import HorizontalLines from "./Lines"
import PillBadge from "./Pill"
import PrizeCategories from "./Categories"

export default function About() {
    return (
        <section id="about" className="relative min-h-[220vh] mt-10 flex flex-col items-center justify-start bg-[#151c43] text-white px-6 py-24">
            <div className="relative flex flex-col items-center justify-center max-w-4xl text-center z-10 w-full">
                <p className="text-lg leading-tight w-[90%] mb-8">
                    Catapult is a 36-hour AI + ML x Entrepreneurship hackathon hosted by ML@Purdue!
                    It is the only ML-focused hackathon at Purdue and is open to all students across all skill levels.
                    Start with an idea, work with others to bring it to life, and share what you've built at the end!
                </p>
                <div className="flex flex-row gap-6 items-center justify-center">
                    <PillBadge text="April 3rd - 5th" width={360} height={140} />
                    <PillBadge text="@ WALC" width={360} height={140} />
                </div>
                <div className="mt-16 relative flex flex-col items-center justify-center text-center z-10">
                    <p className="text-lg w-[80%] leading-tight">
                        <b>4 - 6 people per team.</b> Guaranteed prize awarded to all valid submissions to be claimed at the closing ceremony!
                    </p>
                </div>
            </div>
            <div className="mt-41 relative flex flex-col items-center justify-center max-w-4xl text-center z-10 w-full">
                <h1 className="text-5xl -mb-17 font-semibold">Categories</h1>
                <PrizeCategories />
            </div>
            <HorizontalLines />
        </section>
    )
}