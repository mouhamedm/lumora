import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

import reactIcon from "../assets/icons/react.svg";
import nextjsIcon from "../assets/icons/nextjs.svg";
import typescriptIcon from "../assets/icons/typescript.svg";
import tailwindIcon from "../assets/icons/tailwind.svg";
import flutterIcon from "../assets/icons/flutter.svg";
import javascriptIcon from "../assets/icons/javascript.svg";
import html5Icon from "../assets/icons/html5.svg";
import css3Icon from "../assets/icons/css3.svg";
import gitIcon from "../assets/icons/git.svg";
import figmaIcon from "../assets/icons/figma.svg";
import vscodeIcon from "../assets/icons/vscode.svg";
import githubIcon from "../assets/icons/github.svg";
import nodejsIcon from "../assets/icons/nodejs.svg";
import firebaseIcon from "../assets/icons/firebase.svg";
import gsapIcon from "../assets/icons/gsap.svg";
import framerMotionIcon from "../assets/icons/framer-motion.svg";
import cursorIcon from "../assets/icons/cursor.svg";
import antigravityIcon from "../assets/icons/antigravity.svg";

interface Logo {
  name: string;
  image: string;
}

const techStack: Logo[] = [
  { name: "React", image: reactIcon },
  { name: "Next.js", image: nextjsIcon },
  { name: "TypeScript", image: typescriptIcon },
  { name: "Tailwind CSS", image: tailwindIcon },
  { name: "Flutter", image: flutterIcon },
  { name: "Node.js", image: nodejsIcon },
  { name: "Firebase", image: firebaseIcon },
  { name: "JavaScript", image: javascriptIcon },
  { name: "HTML5", image: html5Icon },
  { name: "CSS3", image: css3Icon },
  { name: "Git", image: gitIcon },
  { name: "Figma", image: figmaIcon },
  { name: "VS Code", image: vscodeIcon },
  { name: "GitHub", image: githubIcon },
  { name: "GSAP", image: gsapIcon },
  { name: "Framer Motion", image: framerMotionIcon },
  { name: "Antigravity", image: antigravityIcon },
  { name: "Cursor", image: cursorIcon },
];

interface FlowingLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  applyMask?: boolean;
}

const FlowingLogo = ({
  children,
  vertical = false,
  repeat = 4,
  pauseOnHover = false,
  reverse = false,
  className,
  applyMask = true,
  ...props
}: FlowingLogoProps) => (
  <div
    {...props}
    className={cn(
      "group relative flex h-full w-full overflow-hidden p-1 [--duration:10s] [--gap:16px] gap-(--gap)",
      vertical ? "flex-col" : "flex-row",
      className,
    )}
  >
    {Array.from({ length: repeat }).map((_, index) => (
      <div
        key={`item-${index}`}
        className={cn("flex shrink-0 gap-(--gap)", {
          "group-hover:paused": pauseOnHover,
          "direction-reverse": reverse,
          "animate-canopy-horizontal flex-row": !vertical,
          "animate-canopy-vertical flex-col": vertical,
        })}
      >
        {children}
      </div>
    ))}
    {applyMask && (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 h-full w-full",
          vertical ? "bg-linear-to-b" : "bg-linear-to-r",
        )}
      />
    )}
  </div>
);

const LogoCard = ({ logo }: { logo: Logo }) => (
  <div className="flex items-center justify-center shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[rgba(23,23,26,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-400/80 hover:shadow-[0_0_15px_rgba(96,165,250,0.25)] hover:bg-[rgba(23,23,26,0.85)] h-14 w-auto px-5 py-3 min-w-24 max-w-64 gap-3">
    <img
      src={logo.image}
      alt={logo.name}
      className="rounded-lg h-full w-auto object-contain max-h-7"
    />
    <span className="text-sm font-medium text-zinc-200 whitespace-nowrap tracking-wide">
      {logo.name}
    </span>
  </div>
);

const FlowingLogos = ({ data }: { data: Logo[] }) => (
  <div className="w-full overflow-hidden flex flex-col gap-4">
    {[false, true, false].map((reverse, index) => (
      <FlowingLogo
        key={`Canopy-${index}`}
        reverse={reverse}
        className="[--duration:30s]"
        pauseOnHover
        applyMask={false}
        repeat={6}
      >
        {data.map((logo, logoIndex) => (
          <LogoCard key={`${logo.name}-${logoIndex}`} logo={logo} />
        ))}
      </FlowingLogo>
    ))}
  </div>
);

export default function Skills() {
  const { t } = useTranslation();

  return (
    <section
      id="skills"
      className="relative w-full overflow-hidden py-16 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Eyebrow Badge */}
        <div className="flex justify-center mb-5">
          <div
            className="inline-flex items-center font-(--font-mono) text-xs tracking-widest uppercase text-(--accent) px-4 py-1.5 bg-(--accent-soft) border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_20px_rgba(76,141,255,0.15)] select-none"
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 text-(--accent)" />
            {t("skills.eyebrow")}
          </div>
        </div>

        {/* Title */}
        <h2 className="relative z-10 mx-auto max-w-4xl text-center font-(--font-display) text-[clamp(38px,4.5vw,64px)] lg:text-[64px] leading-[1.1] tracking-tight mb-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="mr-2 inline-block text-white title-glow"
          >
            {t("skills.title_start")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
            className="inline-block highlight"
          >
            {t("skills.title_highlight")}
          </motion.span>
        </h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-sm sm:text-base text-zinc-400 md:text-lg dark:text-zinc-400"
        >
          {t("skills.subtitle")}
        </motion.p>

        {/* Flowing Marquee Track */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative mt-14"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-linear-to-r from-[#0b0b0c] via-[#0b0b0c]/60 to-transparent dark:from-background dark:via-background/60 dark:to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-linear-to-l from-[#0b0b0c] via-[#0b0b0c]/60 to-transparent dark:from-background dark:via-background/60 dark:to-transparent" />
          <FlowingLogos data={techStack} />
        </motion.div>
      </div>
    </section>
  );
}
