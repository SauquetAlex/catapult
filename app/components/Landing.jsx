"use client";
import { useState, useEffect } from "react";
import Spiral from "./Spiral";
import Lottie from "lottie-react";
import catapultAnimation from "../animations/catapult-load.json";

export default function Landing() {
    const [play, setPlay] = useState(false);

    // Mini timer to get load time
    useEffect(() => {
        const timer = setTimeout(() => setPlay(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Spiral />
            <div className="relative flex flex-col items-center -mt-20 z-10 text-center">
                {play && (
                    <Lottie
                        animationData={catapultAnimation}
                        loop={false}
                        style={{ width: 800 }}
                    />
                )}
            </div>
        </section>
    );
}
