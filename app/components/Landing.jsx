"use client";
import { useState, useEffect, useRef } from "react";
import Spiral from "./Spiral";
import Lottie from "lottie-react";
import catapultAnimation from "../animations/catapult-load.json";

export default function Landing() {
    const [play, setPlay] = useState(false);
    const lottieRef = useRef(null);

    // Mini timer to get load time
    useEffect(() => {
        const timer = setTimeout(() => setPlay(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Handler to replay animation with delay
    const handleComplete = () => {
        setTimeout(() => {
            if (lottieRef.current) {
                lottieRef.current.goToAndPlay(0, true);
            }
        }, 2000); // 2s delay between loops
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Spiral />
            <div className="relative flex flex-col items-center -mt-45 z-10 text-center">
                {play && (
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={catapultAnimation}
                        loop={false}
                        onComplete={handleComplete}
                        style={{ width: 800 }}
                    />
                )}
            </div>
        </section>
    );
}
