"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  Atom,
  BellRing,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Coins,
  Copy,
  Crown,
  DoorOpen,
  ExternalLink,
  EyeOff,
  Flame,
  Gamepad2,
  Ghost,
  Gift,
  HeartPulse,
  Map,
  Palette,
  PartyPopper,
  RefreshCw,
  Skull,
  Sparkles,
  Split,
  Swords,
  Ticket,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Module section header: eyebrow chip + themed icon + title + intro
function SectionHeader({
  eyebrow,
  title,
  intro,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-8 md:mb-12 scroll-reveal text-center">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <Icon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-semibold uppercase tracking-wide">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

// Copy-to-clipboard button for code chips
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; ignore
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy code ${code}`}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] hover:bg-[hsl(var(--nav-theme)/0.15)] transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// Small uppercase label used inside data cards
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1">
      {children}
    </span>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hidefromthevillain.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Hide From The Villain Wiki",
        description:
          "Complete Hide From The Villain Wiki covering codes, TEMP V powers, villains, VC, maps, and survival guides for the Roblox 1vAll stealth survival game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 512,
          height: 512,
          caption: "Hide From The Villain - Roblox 1vAll Stealth Survival",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Hide From The Villain Wiki",
        alternateName: "Hide From The Villain",
        url: siteUrl,
        description:
          "Complete Hide From The Villain Wiki resource hub for codes, TEMP V powers, villains, VC, maps, and survival guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 512,
          height: 512,
          caption: "Hide From The Villain Wiki - Roblox 1vAll Stealth Survival",
        },
        sameAs: [
          "https://www.roblox.com/games/97463774278378/HIDE-FROM-THE-VILLAIN",
          "https://www.roblox.com/communities/35155002/Splitline-World",
          "https://discord.com/invite/6UjnaQBWJA",
          "https://creatorexchange.io/roblox-game/10029297024/hide-from-the-villain",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Hide From The Villain",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Survival", "Stealth", "Action", "Multiplayer"],
        numberOfPlayers: {
          minValue: 2,
          maxValue: 20,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/97463774278378/HIDE-FROM-THE-VILLAIN",
        },
      },
      {
        "@type": "VideoObject",
        name: "Ultimate Guide & Tips Hide From the Villain Roblox",
        description:
          "Ultimate guide and tips for Hide From The Villain on Roblox - strategies to hide from the villain, survive until help arrives, and use TEMP V powers to fight back.",
        thumbnailUrl: "https://i.ytimg.com/vi/MybSsdo0t1E/hqdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/MybSsdo0t1E",
        url: "https://www.youtube.com/watch?v=MybSsdo0t1E",
      },
    ],
  };

  // Accordion states
  const [tempVFaqExpanded, setTempVFaqExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools grid cards -> section anchor mapping
  const sectionIds = [
    "codes",
    "official-links",
    "beginner-guide",
    "temp-v-powers",
    "vc-currency",
    "villain-skins",
    "maps",
    "updates",
  ];

  // Tier badge color via theme opacity (no hardcoded colors)
  const tierStyle = (tier: string) => {
    if (tier === "S")
      return "bg-[hsl(var(--nav-theme)/0.25)] border-[hsl(var(--nav-theme)/0.55)] text-[hsl(var(--nav-theme-light))]";
    if (tier === "A")
      return "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]";
    return "bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.25)] text-muted-foreground";
  };

  // Per-card icons for modules 5-8 (distinct within each group and across modules)
  const vcCurrencyIcons = [Atom, HeartPulse, Palette, Ticket];
  const villainSkinsIcons = [Flame, Crown, Skull, Ghost];
  const mapsIcons = [DoorOpen, EyeOff, Swords, Split, RefreshCw, Timer];
  const updatesIcons = [Trophy, TrendingUp, PartyPopper, Wrench, BellRing, Gamepad2];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors cursor-pointer"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/97463774278378/HIDE-FROM-THE-VILLAIN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - max-w-5xl, autoplay on viewport */}
      <section className="px-4 py-10 md:py-14">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="MybSsdo0t1E"
              title="Ultimate Guide & Tips Hide From the Villain Roblox"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 navigation cards, scroll to matching section */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvCodes.eyebrow}
            title={t.modules.hftvCodes.title}
            intro={t.modules.hftvCodes.intro}
            icon={Gift}
          />

          {/* Active codes */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
            {t.modules.hftvCodes.activeCodes.map((c: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-3 p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <code className="font-mono text-base md:text-lg font-bold text-[hsl(var(--nav-theme-light))] break-all">
                    {c.code}
                  </code>
                  {c.tag && (
                    <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                      {c.tag}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{c.reward}</p>
                <div className="self-start">
                  <CopyCodeButton code={c.code} />
                </div>
              </div>
            ))}
          </div>

          {/* Expired codes */}
          <div className="scroll-reveal mb-8 md:mb-10 p-4 md:p-6 bg-white/[0.02] border border-border rounded-xl">
            <h3 className="flex items-center gap-2 font-bold text-base md:text-lg mb-3">
              <Clock className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              Expired Codes
            </h3>
            <div className="flex flex-wrap gap-2">
              {t.modules.hftvCodes.expiredCodes.map((c: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-border text-sm"
                >
                  <code className="font-mono line-through opacity-60">
                    {c.code}
                  </code>
                  <span className="text-xs text-muted-foreground">
                    — {c.reward}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* How to redeem */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.hftvCodes.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Official Links */}
      <section
        id="official-links"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvOfficialLinks.eyebrow}
            title={t.modules.hftvOfficialLinks.title}
            intro={t.modules.hftvOfficialLinks.intro}
            icon={ExternalLink}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {t.modules.hftvOfficialLinks.items.map(
              (item: any, index: number) => {
                const inner = (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {item.label}
                      </span>
                      {item.href && (
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                      {item.value}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </>
                );
                if (item.href) {
                  return (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:bg-white/[0.07] transition-colors"
                    >
                      {inner}
                    </a>
                  );
                }
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl"
                  >
                    {inner}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvBeginnerGuide.eyebrow}
            title={t.modules.hftvBeginnerGuide.title}
            intro={t.modules.hftvBeginnerGuide.intro}
            icon={BookOpen}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.hftvBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: TEMP V Powers */}
      <section
        id="temp-v-powers"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvTempVPowers.eyebrow}
            title={t.modules.hftvTempVPowers.title}
            intro={t.modules.hftvTempVPowers.intro}
            icon={Zap}
          />

          <div className="scroll-reveal space-y-3 max-w-3xl mx-auto">
            {t.modules.hftvTempVPowers.faqs.map((faq: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setTempVFaqExpanded(
                      tempVFaqExpanded === index ? null : index,
                    )
                  }
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${tempVFaqExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {tempVFaqExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中段阅读停顿 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: VC Currency */}
      <section
        id="vc-currency"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvVCCurrency.eyebrow}
            title={t.modules.hftvVCCurrency.title}
            intro={t.modules.hftvVCCurrency.intro}
            icon={Coins}
          />

          <div className="scroll-reveal space-y-4">
            {t.modules.hftvVCCurrency.rows.map((r: any, index: number) => {
              const Icon = vcCurrencyIcons[index];
              return (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    {r.spendingPath}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {r.category}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <FieldLabel>How to Get</FieldLabel>
                    <p className="text-muted-foreground">{r.howToGet}</p>
                  </div>
                  <div>
                    <FieldLabel>Best For</FieldLabel>
                    <p className="text-muted-foreground">{r.bestFor}</p>
                  </div>
                  <div>
                    <FieldLabel>Value</FieldLabel>
                    <p className="text-muted-foreground">{r.value}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 6: Villain Skins */}
      <section
        id="villain-skins"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvVillainSkins.eyebrow}
            title={t.modules.hftvVillainSkins.title}
            intro={t.modules.hftvVillainSkins.intro}
            icon={Users}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.hftvVillainSkins.tiers.map((tier: any, index: number) => {
              const Icon = villainSkinsIcons[index];
              return (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <Icon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${tierStyle(tier.tier)}`}
                  >
                    {tier.tier}
                  </span>
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.reason}
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <FieldLabel>Unlock Type</FieldLabel>
                    <p className="text-muted-foreground">{tier.unlockType}</p>
                  </div>
                  <div>
                    <FieldLabel>Best For</FieldLabel>
                    <p className="text-muted-foreground">{tier.bestFor}</p>
                  </div>
                  <div>
                    <FieldLabel>VC Plan</FieldLabel>
                    <p className="text-muted-foreground">{tier.vcPlan}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 7: Maps & Hiding */}
      <section
        id="maps"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvMaps.eyebrow}
            title={t.modules.hftvMaps.title}
            intro={t.modules.hftvMaps.intro}
            icon={Map}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.hftvMaps.cards.map((card: any, index: number) => {
              const Icon = mapsIcons[index];
              return (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold text-lg">{card.title}</h3>
                </div>
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] mb-3">
                  {card.focus}
                </span>
                <div className="space-y-3 text-sm">
                  <div>
                    <FieldLabel>What to Do</FieldLabel>
                    <p className="text-muted-foreground">{card.whatToDo}</p>
                  </div>
                  <div>
                    <FieldLabel>Why</FieldLabel>
                    <p className="text-muted-foreground">{card.why}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 8: Updates */}
      <section
        id="updates"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.modules.hftvUpdates.eyebrow}
            title={t.modules.hftvUpdates.title}
            intro={t.modules.hftvUpdates.intro}
            icon={Clock}
          />

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.hftvUpdates.entries.map((entry: any, index: number) => {
              const Icon = updatesIcons[index];
              return (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Icon className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {entry.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {entry.date}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {entry.details}
                  </p>
                  <p className="text-sm">
                    <FieldLabel>Impact</FieldLabel>
                    <span className="text-muted-foreground">{entry.impact}</span>
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/6UjnaQBWJA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/97463774278378/HIDE-FROM-THE-VILLAIN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/35155002/Splitline-World"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://creatorexchange.io/roblox-game/10029297024/hide-from-the-villain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
