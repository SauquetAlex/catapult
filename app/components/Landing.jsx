import Spiral from "./Spiral";
import Image from "next/image";

export default function Landing() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Spiral />
            <div className="relative flex flex-col items-center -mt-20 z-10 text-center">
                <Image 
                    src="/CATAPULT.svg"
                    alt="Catapult"
                    width={800}
                    height={800}
                />
            </div>
        </section>
    )
}