import { Funnel_Display } from "next/font/google";

const funnel = Funnel_Display({ subsets: ["latin"], weight: ["600"] });

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="p-6 rounded-xl bg-zinc-50 dark:bg-white/5 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {icon}
            </div>
            <div className={`${funnel.className}`}>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {description}
              </p>
            </div>
          </div>
        </div>
      );
};