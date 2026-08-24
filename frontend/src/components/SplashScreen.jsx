import { useEffect, useState } from "react";

const SplashScreen = ({ onFinish }) => {
    const [progress, setProgress] = useState(0);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setExiting(true);
                    setTimeout(onFinish, 600);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121214] ${
                exiting ? "animate-slide-up-exit" : ""
            }`}
        >
            <div className="relative mb-8">
                <div className="absolute -inset-3 rounded-3xl border-t-2 border-[#8B5CF6] animate-spin-slow"></div>
                <div className="w-24 h-24 rounded-2xl bg-[#1a1a1d] flex items-center justify-center text-4xl font-bold text-[#8B5CF6]">
                    JE
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-1">
                <span className="text-white">Job</span>
                <span className="text-[#8B5CF6]">Ease</span>
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-8">
                Connecting Talent & Opportunity
            </p>

            <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-[#8B5CF6] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p className="text-[#8B5CF6] text-sm font-medium">{progress}%</p>
        </div>
    );
};

export default SplashScreen;
