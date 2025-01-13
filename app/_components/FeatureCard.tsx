import { Funnel_Display } from "next/font/google";

const funnel = Funnel_Display({ subsets: ["latin"], weight: ["600"] });

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {

    return (
        <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    {icon}
                </div>
            <div>
                <h3 className={`${funnel.className} text-xl text-blue-200`}>{title}</h3>
                <p className={`${funnel.className} text-zinc-400 mt-1 md:block hidden`}>{description}</p>
            </div>
        </div>
  </div>
    );
};