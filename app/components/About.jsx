import HorizontalLines from "./Lines"

export default function About() {
    return (
        <section id="about" className="relative min-h-screen flex items-center overflow-hidden justify-center bg-[#151c43] text-white px-6 py-12">
            <HorizontalLines />
            <div className="relative max-w-4xl text-center z-10">
                <h2 className="text-9xl font-bold mb-6">About</h2>
                <p className="text-lg leading-relaxed mb-8">
                    Catapult is a 36-hour hacakthon hosted by ML@Purdue. I
                </p>
            </div>
        </section>
    )
}