import { motion } from "framer-motion";

interface StreakDisplayProps {
  streak: number;
}

const StreakDisplay = ({ streak }: StreakDisplayProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`text-6xl ${streak > 0 ? "animate-pulse-glow" : ""} rounded-full w-28 h-28 flex items-center justify-center bg-secondary`}>
        {streak > 0 ? "🔥" : "💤"}
      </div>
      <p className="text-lg font-body text-muted-foreground">
        {streak > 0 ? (
          <>
            <span className="text-2xl font-display font-bold text-primary">{streak}</span>{" "}
            day{streak !== 1 ? "s" : ""} streak
          </>
        ) : (
          "No streak yet — start today!"
        )}
      </p>
    </motion.div>
  );
};

export default StreakDisplay;
