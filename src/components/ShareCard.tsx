import { motion } from "framer-motion";
import { X, Download } from "lucide-react";
import { useRef } from "react";

interface ShareCardProps {
  streak: number;
  totalSaved: number;
  onClose: () => void;
}

const ShareCard = ({ streak, totalSaved, onClose }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    // Try native share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Did I Save Today?",
          text: `I've been saving for 🔥 ${streak} days! Total saved: $${totalSaved.toFixed(0)}. Track your savings at didisavetoday.app`,
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `I've been saving for 🔥 ${streak} days! Total saved: $${totalSaved.toFixed(0)} 💰`
      );
      alert("Copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-xs"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground">
          <X size={24} />
        </button>

        {/* Shareable card */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-card via-secondary to-card rounded-3xl p-8 flex flex-col items-center gap-6 border border-border shadow-2xl aspect-[9/16] justify-center"
        >
          <p className="text-sm font-body text-muted-foreground">I've been saving for</p>
          <div className="text-7xl">🔥</div>
          <p className="text-5xl font-display font-bold text-primary">{streak} days</p>
          {totalSaved > 0 && (
            <p className="text-xl font-display text-foreground">
              ${totalSaved.toFixed(0)} saved
            </p>
          )}
          <p className="text-xs text-muted-foreground font-body mt-4">Did I Save Today? 💰</p>
        </div>

        <button
          onClick={handleShare}
          className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold flex items-center justify-center gap-2"
        >
          <Download size={18} /> Share
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ShareCard;
