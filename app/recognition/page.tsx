"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Trophy,
  Star,
  ExternalLink,
  Award,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA ARCHIVE (EXHAUSTIVE) ---
const MAJOR_HONORS = [
  {
    award: "Pulitzer Prize",
    project: "Snowfall",
    year: "2013",
    detail: "Feature Writing (Team)",
    //link: "https://www.pulitzer.org/winners/john-branch",
  },
  {
    award: "Edward R. Murrow",
    project: "Making a Hit",
    year: "2016",
    detail: "Winner: Innovation",
    link: "https://www.wearebroadcasters.com/publicService/story.asp?id=3081",
  },
  {
    award: "News & Doc Emmy",
    project: "One Building, One Bomb",
    year: "2020",
    detail: "New Approaches: Current News",
    //link: "https://theemmys.tv/news-40th-winners/",
  },
  {
    award: "World Press Photo",
    project: "Under a Cracked Sky",
    year: "2018",
    detail: "First Prize, Immersive Storytelling",
    link: "https://www.worldpressphoto.org/collection/storytelling/2018/29075/2018-Under-a-Cracked-Sky",
  },
  {
    award: "Cooper Hewitt",
    project: "National Design Award",
    year: "2009",
    detail: "Communication Design (NYT Team)",
    link: "https://www.cooperhewitt.org/2019/09/17/communication-design-the-new-york-times-graphics-department/",
  },
  {
    award: "Anthem Award",
    project: "Space to Belong (Google)",
    year: "2022",
    detail: "Gold: Diversity, Equity & Inclusion",
    link: "https://www.anthemawards.com/winners/",
  },
];

const ARCHIVE = [
  {
    year: "2020 — Present",
    awards: [
      {
        name: "Anthem Award",
        project: "Space to Belong (Google)",
        detail: "Gold, Diversity Equity & Inclusion",
        link: "https://www.anthemawards.com/winners/",
      },
      {
        name: "News & Documentary Emmy",
        project: "One Building, One Bomb",
        detail: "Winner: New Approaches",
        //link: "https://theemmys.tv/news-40th-winners/",
      },
      {
        name: "SND 41",
        project: "Apollo 11: As They Shot It",
        detail: "Silver Medal",
      },
      {
        name: "SND 41",
        project: "Architecture Review: Hudson Yards",
        detail: "Bronze Medal",
      },
      {
        name: "SND 41",
        project: "Polar Vortex's Dangerously Cold Winds",
        detail: "Bronze Medal",
      },
      {
        name: "SND 41",
        project: "Why Notre-Dame Was a Tinderbox",
        detail: "Award of Excellence",
      },
      {
        name: "SND 41",
        project: "Architecture Review: Hudson Yards",
        detail: "Award of Excellence",
      },
      {
        name: "SND 41",
        project: "Apollo 11: As They Shot It",
        detail: "Award of Excellence (AR/VR)",
      },
      {
        name: "Malofiej 28",
        project: "Notre-Dame Tinderbox",
        detail: "Silver & Bronze",
      },
      {
        name: "Malofiej 28",
        project: "Architecture Review: Hudson Yards",
        detail: "Bronze",
      },
      { name: "Malofiej 28", project: "Apollo 11 (AR)", detail: "Silver" },
    ],
  },
  {
    year: "2019",
    awards: [
      {
        name: "Online News Award",
        project: "Remembering Emmett Till",
        detail: "Winner",
        link: "https://awards.journalists.org/entries/remembering-emmett-till-the-legacy-of-a-lynching/",
      },
      {
        name: "Auggie Award",
        project: "NYT App",
        detail: "Best Consumer AR App",
      },
      {
        name: "Deadline Club Award",
        project: "David Bowie in 3D (AR)",
        detail: "Winner",
      },
      {
        name: "NYT Publisher's Award",
        project: "Hudson Yards Review",
        detail: "First Quarter Winner",
      },
      {
        name: "Webby Award",
        project: "David Bowie in 3D",
        detail: "People's Choice Winner",
        link: "https://winners.webbyawards.com/2019/apps-mobile-and-voice/apps-mobile-features/experimental-innovation/88659/nytimes-magicleap-david-bowie-in-three-dimensions",
      },
      {
        name: "Webby Award",
        project: "Ashley Graham, Unfiltered",
        detail: "Finalist",
      },
      {
        name: "Next Reality",
        project: "Graham Roberts",
        detail: "50 People to Follow in VR",
      },
      {
        name: "Polar Film Festival",
        project: "Under a Cracked Sky",
        detail: "Official Selection",
      },
      { name: "SND 40", project: "Olympians in AR", detail: "Gold Medal" },
      {
        name: "SND 40",
        project: "Winter Olympics Special Section",
        detail: "Gold Medal",
      },
      {
        name: "Malofiej 27",
        project: "One Building, One Bomb",
        detail: "Bronze",
      },
      { name: "Digiday", project: "NYT AR Efforts", detail: "Article Feature" },
    ],
  },
  {
    year: "2018",
    awards: [
      {
        name: "World Press Photo",
        project: "Under a Cracked Sky",
        detail: "1st Prize: Immersive",
        link: "https://www.worldpressphoto.org/collection/storytelling/2018/29075/2018-Under-a-Cracked-Sky",
      },
      {
        name: "Lumiere Award",
        project: "Sensations of Sound",
        detail: "Winner",
      },
      {
        name: "Next Reality",
        project: "Graham Roberts",
        detail: "Top AR Influencers of 2018",
      },
      {
        name: "National Academies Award",
        project: "The Antarctica Series",
        detail: "Finalist",
      },
      {
        name: "Online News Award",
        project: "David Bowie in 3D",
        detail: "Finalist: Immersive Storytelling",
      },
      {
        name: "Big Sky Doc Festival",
        project: "The Antarctica Series",
        detail: "Official Selection",
      },
      { name: "Malofiej 26", project: "Shape of You", detail: "Gold Medal" },
      { name: "SND 39", project: "Shape of You", detail: "Silver Medal" },
      {
        name: "SND 39",
        project: "The Antarctica Series",
        detail: "Award of Excellence",
      },
      {
        name: "SND 39",
        project: "Miles of Ice Collapsing",
        detail: "Silver Medal",
      },
      {
        name: "Tribeca Film Festival",
        project: "Under a Cracked Sky",
        detail: "Official Selection",
      },
      {
        name: "SF Film Festival",
        project: "Under a Cracked Sky",
        detail: "Official Selection",
      },
      {
        name: "Milano Film Festival",
        project: "Under a Cracked Sky",
        detail: "Official Selection",
      },
      {
        name: "SIGGRAPH VR Theater",
        project: "Under a Cracked Sky",
        detail: "Official Selection",
      },
      {
        name: "Nantucket Film Festival",
        project: "Under a Cracked Sky",
        detail: "Official Selection",
      },
      {
        name: "Sydney Film Festival",
        project: "Under a Cracked Sky",
        detail: "Official Selection",
      },
    ],
  },
  {
    year: "2017",
    awards: [
      {
        name: "Webby Award",
        project: "The Modern Games",
        detail: "Winner",
        link: "https://winners.webbyawards.com/2017/video/general-video/vr-cinematic-or-pre-rendered/12683/the-new-york-times-the-modern-games-vr-experience",
      },
      {
        name: "Malofiej 25",
        project: "Pluto's Frigid Heart",
        detail: "Silver Medal",
      },
      {
        name: "Online News Award",
        project: "Families Funding 2016 Election",
        detail: "Nomination",
      },
      {
        name: "Online News Award",
        project: "Facing a 150 MPH Serve",
        detail: "Nomination",
      },
      { name: "Poynter", project: "The Modern Games", detail: "Coverage" },
      { name: "UploadVR", project: "The Modern Games", detail: "Coverage" },
      {
        name: "Tribeca Film Festival",
        project: "Pluto's Frigid Heart",
        detail: "Official Selection",
      },
    ],
  },
  {
    year: "2016",
    awards: [
      {
        name: "News & Doc Emmy",
        project: "Making a Hit (Bieber)",
        detail: "Nomination",
      },
      {
        name: "Edward R. Murrow",
        project: "Making a Hit (Bieber)",
        detail: "Winner: Innovation",
        link: "https://www.wearebroadcasters.com/publicService/story.asp?id=3081",
      },
      {
        name: "Pulitzer Prize",
        project: "Vigils in Paris VR",
        detail: "Finalist (Team)",
      },
      {
        name: "ASNE Award",
        project: "A New Whitney / Sound Matters",
        detail: "Winner",
      },
      {
        name: "Malofiej 24",
        project: "Making a Hit (Bieber)",
        detail: "Bronze Medal",
      },
      {
        name: "NYT Publisher's Award",
        project: "Buying Power",
        detail: "Winner",
      },
      {
        name: "Communication Arts",
        project: "Graham Roberts",
        detail: "Interview",
      },
      { name: "Billboard", project: "Making a Hit", detail: "Coverage" },
    ],
  },
  {
    year: "2015",
    awards: [
      {
        name: "News & Doc Emmy",
        project: "Inside the Quartet",
        detail: "Nomination",
      },
      {
        name: "News & Doc Emmy",
        project: "Winter Tales of Speed",
        detail: "Nomination",
      },
      {
        name: "Malofiej 23",
        project: "Inside the Quartet",
        detail: "Gold Medal",
      },
      { name: "POYi Award", project: "Inside the Quartet", detail: "Winner" },
      {
        name: "SND 36",
        project: "Inside the Quartet",
        detail: "Award of Excellence",
      },
      {
        name: "SND 36",
        project: "A New Story at Ground Zero",
        detail: "Award of Excellence",
      },
      {
        name: "Online News Award",
        project: "Paying Till It Hurts",
        detail: "Winner",
        link: "https://awards.journalists.org/entries/paying-till-hurts/",
      },
      {
        name: "Online News Award",
        project: "Sochi Olympics",
        detail: "Finalist",
      },
    ],
  },
  {
    year: "2014",
    awards: [
      { name: "News & Doc Emmy", project: "The Jockey", detail: "Nomination" },
      {
        name: "NYT Publisher's Award",
        project: "Ballad of Geeshie and Elvie",
        detail: "Special Citation",
      },
      {
        name: "Malofiej 22",
        project: "A Staggering Migration",
        detail: "Bronze Medal",
      },
      { name: "SND 35", project: "NYT Portfolio", detail: "Silver Medal" },
      {
        name: "NYT Publisher's Award",
        project: "Invisible Child",
        detail: "Special Citation",
      },
      {
        name: "NPPA Award",
        project: "The Jockey",
        detail: "Best Use of Multimedia",
      },
    ],
  },
  {
    year: "2013",
    awards: [
      {
        name: "Pulitzer Prize",
        project: "Snowfall",
        detail: "Winner: Feature Writing",
        link: "https://www.pulitzer.org/winners/john-branch",
      },
      {
        name: "Peabody Award",
        project: "Snowfall",
        detail: "Winner",
        link: "https://peabodyawards.com/award-profile/snow-fall-the-avalanche-at-tunnel-creek/",
      },
      {
        name: "Webby Award",
        project: "Snowfall",
        detail: "Winner",
      },
      { name: "News & Doc Emmy", project: "Snowfall", detail: "Nomination" },
      { name: "Malofiej 21", project: "Snowfall", detail: "Gold Medal" },
      {
        name: "Malofiej 21",
        project: "Olympics Portfolio",
        detail: "Gold Medal",
      },
      { name: "Malofiej 21", project: "Swing States", detail: "Silver Medal" },
      {
        name: "Malofiej 21",
        project: "The iPhone Economy",
        detail: "Silver Medal",
      },
      {
        name: "Malofiej 21",
        project: "Shooting of Trayvon Martin",
        detail: "Bronze Medal",
      },
      { name: "SND 34", project: "Snowfall", detail: "Gold Medal" },
      {
        name: "SND 34",
        project: "One Race, Every Medalist",
        detail: "Award of Excellence",
      },
      {
        name: "Scripps Howard",
        project: "Snowfall / One Race",
        detail: "Digital Innovation Award",
      },
      {
        name: "Punch Sulzberger Award",
        project: "Snowfall",
        detail: "Online Storytelling",
      },
      {
        name: "NYT Publisher's Award",
        project: "Connecting Music and Gesture",
        detail: "Winner",
      },
      {
        name: "Online Journalism Award",
        project: "Connecting Music and Gesture",
        detail: "Winner",
      },
    ],
  },
  {
    year: "2012 & Prior",
    awards: [
      {
        name: "Missouri Honor Medal",
        project: "NYT Graphics Dept",
        detail: "Distinguished Service (2012)",
      },
      {
        name: "Malofiej 20",
        project: "Egypt's Revolution",
        detail: "Silver Medal (2012)",
      },
      {
        name: "Malofiej 20",
        project: "Marathon Route",
        detail: "Bronze Medal (2012)",
      },
      {
        name: "Malofiej 20",
        project: "The Raid",
        detail: "Bronze Medal (2012)",
      },
      {
        name: "Malofiej 20",
        project: "Natural Gas",
        detail: "Bronze Medal (2012)",
      },
      {
        name: "SND 33",
        project: "The New Met Wing",
        detail: "Gold Medal (2012)",
      },
      {
        name: "SND 33",
        project: "Marathon Route",
        detail: "Silver Medal (2012)",
      },
      {
        name: "SND 33",
        project: "Bin Laden / Ground Zero",
        detail: "Awards of Excellence (2012)",
      },
      {
        name: "News & Doc Emmy",
        project: "Deepwater Horizon",
        detail: "Nomination (2011)",
      },
      {
        name: "Webby Award",
        project: "Held by the Taliban",
        detail: "Winner (2011)",
      },
      {
        name: "Online Journalism Award",
        project: "Held by the Taliban",
        detail: "Winner (2011)",
      },
      {
        name: "Malofiej 19",
        project: "Mariano Rivera",
        detail: "Best in Show (2011)",
      },
      {
        name: "Malofiej 19",
        project: "Mariano Rivera",
        detail: "Gold Medal (2011)",
      },
      {
        name: "Malofiej 19",
        project: "Reviving Ground Zero",
        detail: "Silver Medal (2011)",
      },
      {
        name: "National Design Award",
        project: "NYT Graphics Dept",
        detail: "Communication Design (2009)",
        link: "https://www.cooperhewitt.org/2019/09/17/communication-design-the-new-york-times-graphics-department/",
      },
      {
        name: "Malofiej 17",
        project: "Crane Collapse",
        detail: "Silver Medal (2009)",
      },
      {
        name: "SND 30",
        project: "Information Graphics",
        detail: "Award of Excellence (2009)",
      },
      {
        name: "Malofiej 16",
        project: "Critical Parts",
        detail: "Bronze Medal (2008)",
      },
      {
        name: "SND 28",
        project: "Information Graphics",
        detail: "Award of Excellence (2007)",
      },
    ],
  },
];

export default function AwardsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-neutral-950 text-neutral-200 min-h-screen font-sans selection:bg-white selection:text-black">
      {/* --- NAV --- */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
        {/* Left: Home Link */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold tracking-tight">BACK TO INDEX</span>
        </Link>

        {/* Right: Desktop Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/about" className="hover:opacity-50 transition-opacity">
            About
          </Link>
          <Link href="/#work" className="hover:opacity-50 transition-opacity">
            Work
          </Link>
          <Link href="/recognition" className="opacity-100">
            Recognition
          </Link>
          <Link
            href="/speaking"
            className="hover:opacity-50 transition-opacity"
          >
            Speaking
          </Link>
        </div>

        {/* Right: Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-950 z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <Link
              href="/about"
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#work"
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Work
            </Link>
            <Link
              href="/recognition"
              className="text-3xl font-bold text-neutral-500 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Recognition
            </Link>
            <Link
              href="/speaking"
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Speaking
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO HEADER --- */}
      <header className="relative h-[80vh] flex items-end justify-center pb-24 px-6 overflow-hidden">
        {/* COVER IMAGE */}
        <div className="absolute inset-0 z-0">
          <img
            src="/graham-awards.jpg"
            alt="Awards & Recognition"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8">
            Recognition
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            A history of pushing the boundaries of digital storytelling,
            recognized by the highest honors in journalism and design.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-32">
        {/* Major Honors Grid */}
        <section className="mb-32">
          <div className="flex items-center justify-center gap-3 mb-12 text-yellow-500">
            <Trophy className="w-6 h-6" />
            <h2 className="text-sm font-mono uppercase tracking-widest">
              Major Honors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAJOR_HONORS.map((item, i) => {
              // Conditional wrapper logic
              const Wrapper = item.link ? Link : "div";
              const props = item.link
                ? {
                    href: item.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {};

              return (
                <Wrapper
                  key={i}
                  {...props}
                  className={`bg-neutral-900/50 border border-neutral-800 p-8 text-center rounded-sm transition-colors group ${
                    item.link ? "hover:bg-neutral-900 cursor-pointer" : ""
                  }`}
                >
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {item.award}
                  </h3>
                  <div className="text-neutral-300 font-medium mb-2">
                    {item.project}
                  </div>
                  <div className="text-neutral-500 text-sm font-mono">
                    {item.detail} • {item.year}
                  </div>
                  {item.link && (
                    <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-neutral-600" />
                    </div>
                  )}
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* The Archive List */}
        <section>
          <div className="flex items-center gap-3 mb-12 text-neutral-500 border-b border-neutral-800 pb-4">
            <Award className="w-6 h-6" />
            <h2 className="text-sm font-mono uppercase tracking-widest">
              Complete Archive
            </h2>
          </div>

          <div className="space-y-16">
            {ARCHIVE.map((group, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-neutral-600 sticky top-32">
                    {group.year}
                  </h3>
                </div>
                <div className="md:col-span-10 space-y-4">
                  {group.awards.map((award, j) => {
                    const Wrapper = award.link ? Link : "div";
                    const props = award.link
                      ? {
                          href: award.link,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {};

                    return (
                      <Wrapper
                        key={j}
                        {...props}
                        className={`flex flex-col md:flex-row md:items-baseline justify-between py-4 border-b border-neutral-800/50 px-4 -mx-4 rounded-sm transition-colors group ${
                          award.link
                            ? "hover:bg-neutral-900/50 cursor-pointer"
                            : "hover:bg-neutral-900/10"
                        }`}
                      >
                        <div className="flex-1">
                          <span className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors block md:inline">
                            {award.project}
                          </span>
                          <span className="hidden md:inline mx-3 text-neutral-600">
                            /
                          </span>
                          <span className="text-neutral-400 text-sm md:text-base">
                            {award.name}
                          </span>
                        </div>
                        <div className="mt-2 md:mt-0 font-mono text-xs text-neutral-500 uppercase tracking-wider shrink-0 flex items-center gap-2">
                          {award.detail}
                          {award.link && (
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
