"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Mic,
  Users,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA ARCHIVE (Full List) ---

const TEACHING = [
  {
    org: "CUNY Graduate School of Journalism",
    role: "Adjunct Professor",
    detail: "Visual Journalism & Motion Graphics (2014-2018)",
    link: "https://www.journalism.cuny.edu/",
  },
  {
    org: "The School of The New York Times",
    role: "Instructor",
    detail: "Virtual Reality Professional Certificate (2016-2018)",
    link: "https://nytedu.com/",
  },
  {
    org: "Aquent Gymnasium",
    role: "Course Creator",
    detail: "Information Design & Visualization",
    //link: "https://thegymnasium.com/courses/information-design-and-visualization",
  },
  {
    org: "Skillshare",
    role: "Course Creator",
    detail: "Animated Information Graphics & Maya 3D",
    //link: "https://www.skillshare.com/en/classes/Animated-Information-Graphics-An-Introduction-to-Maya-3D/1872728965",
  },
];

const ERA_1 = [
  // Recent & Upcoming
  {
    year: "2025",
    event: "Bridge Summit",
    location: "Abu Dhabi, UAE",
    role: "Keynote",
    link: "https://www.bridgesummit.com/",
  },
  {
    year: "2025",
    event: "XPerts Series: Data Visualization",
    location: "Virtual",
    role: "Speaker",
  },
  {
    year: "2024",
    event: "Novartis Panel",
    location: "New York, NY",
    role: "Panelist",
  },
  {
    year: "2024",
    event: "Havas Data Different(ly)",
    location: "New York, NY",
    role: "Speaker",
  },
  {
    year: "2024",
    event: "Havas Fun For Thoughts!",
    location: "San Francisco, CA",
    role: "Speaker",
  },
  {
    year: "2024",
    event: "Havas Life Lately",
    location: "NY / Chicago",
    role: "Speaker",
  },
];

const ERA_2 = [
  // The VR/AR Boom (2016-2019)
  {
    year: "2019",
    event: "AWE Nite Meetup",
    location: "Brooklyn, NY",
    role: "Speaker",
  },
  {
    year: "2019",
    event: "Realities360 Conference",
    location: "San Jose, CA",
    role: "Keynote",
  },
  {
    year: "2019",
    event: "Augmented World Expo (AWE)",
    location: "Santa Clara, CA",
    role: "Keynote",
    link: "https://www.awexr.com/usa-2019/agenda/797-storytelling-in-ar",
  },
  {
    year: "2018",
    event: "De Persgroep Masterclass",
    location: "Amsterdam, NL",
    role: "Masterclass",
  },
  {
    year: "2018",
    event: "SND Amsterdam",
    location: "Amsterdam, NL",
    role: "Speaker",
  },
  {
    year: "2018",
    event: "World Conference on VR Industry",
    location: "Nanchang, China",
    role: "Keynote",
  },
  {
    year: "2018",
    event: "IVMG Annual Meeting",
    location: "Springfield, VA",
    role: "Keynote",
  },
  {
    year: "2018",
    event: "Science Media Awards & Summit",
    location: "Boston, MA",
    role: "Panelist",
  },
  {
    year: "2018",
    event: "XR for Change",
    location: "New York, NY",
    role: "Keynote",
  },
  {
    year: "2018",
    event: "Metrograph: Frontiers of Design",
    location: "New York, NY",
    role: "Panelist",
  },
  {
    year: "2018",
    event: "Northside Festival Innovation",
    location: "Brooklyn, NY",
    role: "Speaker",
  },
  {
    year: "2018",
    event: "Media Convention Berlin",
    location: "Berlin, Germany",
    role: "Speaker",
  },
  {
    year: "2018",
    event: "Design Week Portland",
    location: "Portland, OR",
    role: "Panelist",
  },
  {
    year: "2018",
    event: "Dickinson College (Clarke Forum)",
    location: "Carlisle, PA",
    role: "Panelist",
  },
  {
    year: "2018",
    event: "Brown Institute (Columbia Univ)",
    location: "New York, NY",
    role: "Lecture",
  },
  {
    year: "2018",
    event: "Lycée Français de New York",
    location: "New York, NY",
    role: "Talk",
  },
  {
    year: "2018",
    event: "Berliner Festspiele",
    location: "Berlin, Germany",
    role: "Panelist",
  },
  {
    year: "2017",
    event: "Columbia Business School",
    location: "New York, NY",
    role: "Talk",
  },
  {
    year: "2017",
    event: "Samsung837 Sports Coverage",
    location: "New York, NY",
    role: "Panelist",
  },
  {
    year: "2017",
    event: "SIGGRAPH",
    location: "Los Angeles, CA",
    role: "Keynote",
    link: "https://s2017.siggraph.org/",
  },
  {
    year: "2017",
    event: "Chinese Comm. of Communication",
    location: "Taipei, Taiwan",
    role: "Keynote",
  },
  {
    year: "2017",
    event: "Sight, Sound & Story",
    location: "New York, NY",
    role: "Speaker",
  },
  {
    year: "2017",
    event: "Meduza Conference",
    location: "Moscow, Russia",
    role: "Talk",
  },
  {
    year: "2017",
    event: "Indiana University Media School",
    location: "Bloomington, IN",
    role: "Keynote",
  },
  {
    year: "2017",
    event: "Ivy Film Festival",
    location: "Providence, RI",
    role: "VR Panel",
  },
  {
    year: "2017",
    event: "The Video Consortium",
    location: "New York, NY",
    role: "Speaker",
  },
  {
    year: "2017",
    event: "City College of New York",
    location: "New York, NY",
    role: "Guest Lecture",
  },
  {
    year: "2017",
    event: "TechCrunch Panel",
    location: "New York, NY",
    role: "Panelist",
  },
  {
    year: "2016",
    event: "StoryNEXT VR",
    location: "New York, NY",
    role: "Speaker",
  },
  {
    year: "2016",
    event: "Times Insider Events",
    location: "New York, NY",
    role: "Speaker",
  },
  {
    year: "2016",
    event: "T-Edge VR Summit",
    location: "Shenzhen, China",
    role: "Speaker",
  },
  {
    year: "2016",
    event: "SF Film Society",
    location: "San Francisco, CA",
    role: "Panelist",
  },
  {
    year: "2016",
    event: "Univ. of Maryland",
    location: "College Park, MD",
    role: "Visiting Futurist",
  },
  { year: "2016", event: "SXSW", location: "Austin, TX", role: "Panelist" },
  { year: "2016", event: "UNICEF", location: "New York, NY", role: "Talk" },
  {
    year: "2016",
    event: "IFP Made in NY Media Center",
    location: "New York, NY",
    role: "Panelist",
  },
];

const ERA_3 = [
  // The Visual Journalism Era (2011-2015)
  {
    year: "2015",
    event: "Skidmore College",
    location: "Saratoga Springs, NY",
    role: "Lecture",
  },
  {
    year: "2015",
    event: "Hopscotch Design Festival",
    location: "Raleigh, NC",
    role: "Speaker",
  },
  {
    year: "2015",
    event: "Ragan's Visual Summit",
    location: "Denver, CO",
    role: "Closing Keynote",
  },
  {
    year: "2015",
    event: "Classical:NEXT",
    location: "Rotterdam, NL",
    role: "Presenter",
  },
  {
    year: "2015",
    event: "Erasmus University",
    location: "Rotterdam, NL",
    role: "Lecture",
  },
  { year: "2015", event: "SPUI25", location: "Amsterdam, NL", role: "Lecture" },
  {
    year: "2015",
    event: "Ragan's Visual Summit",
    location: "Chicago, IL",
    role: "Closing Keynote",
  },
  {
    year: "2014",
    event: "Naprej/Forward Media Fest",
    location: "Ljubljana, Slovenia",
    role: "Lecture",
  },
  { year: "2014", event: "You The Designer", location: "Online", role: "Q&A" },
  { year: "2014", event: "Made by Morel", location: "Online", role: "Q&A" },
  {
    year: "2014",
    event: "SXSW Interactive",
    location: "Austin, TX",
    role: "Speaker",
    link: "https://schedule.sxsw.com/2014/events/event_IAP20760",
  },
  { year: "2014", event: "SCAD", location: "Savannah, GA", role: "Speaker" },
  {
    year: "2013",
    event: "UPenn ArtDesViz",
    location: "Philadelphia, PA",
    role: "Speaker",
  },
  {
    year: "2013",
    event: "School of Visual Arts",
    location: "New York, NY",
    role: "Speaker",
  },
  {
    year: "2013",
    event: "British Higher School of Art",
    location: "Moscow (Video)",
    role: "Speaker",
  },
  {
    year: "2013",
    event: "Malofiej 21",
    location: "Pamplona, Spain",
    role: "Speaker",
  },
  {
    year: "2012",
    event: "Media Sandbox Capstone",
    location: "Lansing, MI",
    role: "Speaker",
  },
  {
    year: "2011",
    event: "WIP/ARTY 3",
    location: "Brooklyn, NY",
    role: "Speaker",
  },
];

// --- COMPONENT ---

export default function SpeakingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-neutral-950 text-neutral-200 min-h-screen font-sans selection:bg-white selection:text-black">
      {/* --- NAV --- */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold tracking-tight">BACK TO INDEX</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/about" className="hover:opacity-50 transition-opacity">
            About
          </Link>
          <Link href="/#work" className="hover:opacity-50 transition-opacity">
            Work
          </Link>
          <Link
            href="/recognition"
            className="hover:opacity-50 transition-opacity"
          >
            Recognition
          </Link>
          <Link href="/speaking" className="opacity-100">
            Speaking
          </Link>
        </div>

        {/* Mobile Toggle */}
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
              className="text-3xl font-bold text-white hover:text-neutral-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Recognition
            </Link>
            <Link
              href="/speaking"
              className="text-3xl font-bold text-neutral-500 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Speaking
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO HEADER --- */}
      <header className="relative h-[80vh] flex items-end justify-center pb-24 px-6 overflow-hidden">
        {/* EDITORIAL IMAGE 1: Main Header (Full Color) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Berlin_MCB_sharingTop.jpg"
            alt="Speaking at Conference"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-6">
            SPEAKING
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-12">
            Sharing insights on the intersection of design, technology, and
            journalism at stages around the world.
          </p>

          {/* MOVED CTA: LOOKING FOR SPEAKER */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-neutral-400 font-mono text-sm uppercase tracking-widest">
              Looking for a speaker?
            </p>
            <a
              href="mailto:graham@grahaphics.com"
              className="inline-block px-8 py-3 bg-white text-black font-bold tracking-tight hover:bg-neutral-200 transition-colors rounded-full"
            >
              Request Availability
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-24">
        {/* --- SECTION: TEACHING --- */}
        <section className="mb-32">
          <div className="flex items-center gap-3 mb-12 text-white border-b border-white/20 pb-4">
            <Users className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Teaching & Academia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEACHING.map((item, i) => {
              // Wrapper logic for teaching items
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
                  className={`bg-neutral-900 border border-neutral-800 p-8 rounded-sm transition-colors group ${
                    item.link ? "hover:border-neutral-600 cursor-pointer" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {item.org}
                    </h3>
                    {item.link && (
                      <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                    )}
                  </div>
                  <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-4">
                    {item.role}
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* --- SECTION: ERA 1 (Recent) --- */}
        <section>
          <div className="flex items-center gap-3 mb-12 text-white border-b border-white/20 pb-4 sticky top-24 bg-neutral-950 z-20">
            <Mic className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Recent Engagements</h2>
          </div>
          <div className="space-y-0">
            {ERA_1.map((item, i) => (
              <EngagementItem key={i} {...item} />
            ))}
          </div>
        </section>
      </main>

      {/* --- VISUAL BREAK 1 --- */}
      <section className="relative w-full h-[50vh] overflow-hidden my-12">
        <img
          src="/speaking-1.jpg"
          alt="Conference Hall"
          className="w-full h-full object-cover opacity-60 fixed-bg"
        />
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-24">
        {/* --- SECTION: ERA 2 (2016-2019) --- */}
        <section>
          <div className="space-y-0">
            {ERA_2.map((item, i) => (
              <EngagementItem key={i} {...item} />
            ))}
          </div>
        </section>
      </main>

      {/* --- VISUAL BREAK 2 (UPDATED) --- */}
      <section className="relative w-full h-[50vh] overflow-hidden my-12">
        <img
          src="/speaking-2.jpg"
          alt="Speaking on Stage"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Text Removed */}
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-24">
        {/* --- SECTION: ERA 3 (2011-2015) --- */}
        <section>
          <div className="space-y-0">
            {ERA_3.map((item, i) => (
              <EngagementItem key={i} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// --- HELPER COMPONENT ---
const EngagementItem = ({
  year,
  event,
  location,
  role,
  link,
}: {
  year: string;
  event: string;
  location: string;
  role: string;
  link?: string;
}) => {
  const Wrapper = link ? Link : "div";
  const props = link
    ? { href: link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...props}
      className={`group flex flex-col md:flex-row md:items-baseline justify-between py-6 border-b border-neutral-800 transition-all duration-300 ${
        link
          ? "hover:bg-neutral-900/50 hover:pl-6 cursor-pointer"
          : "hover:bg-neutral-900/10 cursor-default"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 flex-1">
        <span className="font-mono text-neutral-600 w-12 text-sm">{year}</span>
        <span className="text-xl font-medium text-neutral-300 group-hover:text-white transition-colors flex items-center gap-3">
          {event}
          {link && (
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          )}
        </span>
      </div>
      <div className="flex items-center gap-6 mt-2 md:mt-0 text-neutral-500 font-mono text-xs md:text-sm shrink-0">
        <span className="hidden md:inline-block px-2 py-1 border border-neutral-800 rounded text-[10px] uppercase tracking-wider">
          {role}
        </span>
        <span className="flex items-center gap-2 w-48 justify-end">
          <MapPin className="w-3 h-3" />
          {location}
        </span>
      </div>
    </Wrapper>
  );
};
