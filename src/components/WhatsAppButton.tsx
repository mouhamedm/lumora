import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUp } from "lucide-react";
import whatsappIcon from "../assets/icons/whatsapp-icon.svg";

export interface WhatsAppButtonProps {
  isLoaded?: boolean;
  isMenuOpen?: boolean;
}

export default function WhatsAppButton({
  isLoaded = true,
  isMenuOpen = false,
}: WhatsAppButtonProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language?.startsWith("fr");
  const [isWaHovered, setIsWaHovered] = useState(false);
  const [isTopHovered, setIsTopHovered] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button after passing Hero section (450px)
      setShowScrollTop(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isLoaded && !isMenuOpen && (
        <motion.div
          key="whatsapp-container"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] flex flex-col items-end gap-3 pointer-events-none"
        >
      {/* Scroll to Top Button (appears directly above WhatsApp button after passing Hero) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center gap-2 pointer-events-auto"
          >
            {/* Tooltip for Scroll to Top */}
            <AnimatePresence>
              {isTopHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="hidden sm:block px-3 py-1 rounded-full bg-[rgba(15,20,25,0.92)] border border-[rgba(76,141,255,0.3)] text-white text-xs font-medium backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.5)] pointer-events-none select-none"
                >
                  {isFr ? "Haut de page" : "Scroll to top"}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={scrollToTop}
              onMouseEnter={() => setIsTopHovered(true)}
              onMouseLeave={() => setIsTopHovered(false)}
              aria-label={isFr ? "Retourner en haut" : "Scroll to top"}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-[rgba(23,23,26,0.85)] border border-white/15 text-white backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(76,141,255,0.15)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_rgba(76,141,255,0.4)] transition-colors cursor-pointer group"
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.92 }}
            >
              <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animated WhatsApp Button */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Interactive Tooltip on Hover */}
        <AnimatePresence>
          {isWaHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(15,20,25,0.92)] border border-emerald-500/30 text-white text-xs font-medium backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_15px_rgba(37,211,102,0.2)] pointer-events-none select-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isFr ? "Discuter sur WhatsApp" : "Chat on WhatsApp"}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href="https://wa.me/2250719076206"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter sur WhatsApp"
          onMouseEnter={() => setIsWaHovered(true)}
          onMouseLeave={() => setIsWaHovered(false)}
          className="relative group w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-[#1EBE5D] via-[#25D366] to-[#40E37C] shadow-[0_10px_30px_rgba(37,211,102,0.4),0_0_20px_rgba(37,211,102,0.3)] cursor-pointer select-none"
          // Continuous playful floating and periodic wiggles
          animate={{
            y: [0, -7, 0, -4, 0],
            rotate: [0, 0, -10, 10, -6, 6, 0, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.45, 0.5, 0.55, 0.6, 1],
          }}
          whileHover={{
            scale: 1.12,
            boxShadow: "0 15px 35px rgba(37,211,102,0.6), 0 0 30px rgba(37,211,102,0.5)",
          }}
          whileTap={{ scale: 0.92 }}
        >
          {/* Radar ping ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/35 animate-ping pointer-events-none" />

          {/* Ambient glow backdrop */}
          <span className="absolute -inset-2 rounded-full bg-[#25D366]/20 blur-md pointer-events-none group-hover:bg-[#25D366]/40 transition-colors" />

          {/* Online Status Beacon */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-[#0b0b0c] rounded-full shadow-[0_0_8px_#34d399] z-10" />

          {/* Local WhatsApp Icon Asset */}
          <img
            src={whatsappIcon}
            alt="WhatsApp"
            className="w-7 h-7 relative z-10 select-none pointer-events-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
          />
        </motion.a>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
