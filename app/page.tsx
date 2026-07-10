"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Bell,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Ticket,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HomeClientProps {
  isSignedIn: boolean;
  firstName: string | null;
}

const NAV_LINKS = [
  { id: "happening", label: "Happening" },
  { id: "how-it-works", label: "How It Works" },
  { id: "roles", label: "For You" },
];

const LINEUP = [
  { tag: "WORKSHOP", title: "Hackathon 2026", when: "Mar 15", note: "200 registered" },
  { tag: "SERIES", title: "Tech Talk Tuesdays", when: "Weekly", note: "150 members" },
  { tag: "FESTIVAL", title: "Spring Campus Fest", when: "Apr 02", note: "Tickets live" },
  { tag: "MEETUP", title: "Founders Circle", when: "Mar 22", note: "32 spots left" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function HomeClient({ isSignedIn, firstName }: HomeClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;
    if (menuOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [menuOpen]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          "[data-animate], [data-hero-badge], [data-hero-title], [data-hero-text], [data-hero-buttons], [data-ticket]",
          { clearProps: "all" }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-nav-inner]", { y: -16, opacity: 0, duration: 0.5 })
        .from("[data-hero-badge]", { y: 16, opacity: 0, duration: 0.5 }, "-=0.2")
        .from("[data-hero-title] span", { y: 40, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.2")
        .from("[data-hero-text]", { y: 18, opacity: 0, duration: 0.6 }, "-=0.4")
        .from("[data-hero-buttons]", { y: 18, opacity: 0, duration: 0.6 }, "-=0.4")
        .from("[data-ticket]", { rotate: 8, y: 30, opacity: 0, duration: 0.8, ease: "back.out(1.4)" }, "-=0.5");

      gsap.to("[data-hero-blob='1']", {
        x: 50, y: -30, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to("[data-hero-blob='2']", {
        x: -40, y: 40, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
        const target = Number(el.dataset.countTo ?? 0);
        const suffix = el.dataset.countSuffix ?? "";
        const counter = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              val: target,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${Math.floor(counter.val)}${suffix}`;
              },
            });
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-animate='fade-up']").forEach((el, i) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.7,
          delay: (i % 4) * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-animate='pop']").forEach((el, i) => {
        gsap.from(el, {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      gsap.to("[data-progress-bar]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 84;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const primaryCtaHref = isSignedIn ? "/events" : "/sign-up";
  const organizeHref = isSignedIn ? "/dashboard" : "/sign-in";

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FBF9FC] text-slate-900 ">
      <div
        data-progress-bar
        className="fixed top-0 left-0 right-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500  z-[60]"
      />

      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 shadow-sm border-b border-slate-100" : "bg-transparent"
        }`}
      >
        <div data-nav-inner className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </span>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Evently
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition uppercase tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <Link
                href={isSignedIn ? "/dashboard" : "/sign-in"}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition"
              >
                {isSignedIn ? `Hi, ${firstName ?? "there"}` : "Sign In"}
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden p-2 -mr-2 text-slate-700"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div ref={mobileMenuRef} className="md:hidden overflow-hidden h-0 opacity-0">
          <div className="px-5 pb-6 pt-2 space-y-4 bg-white border-t border-slate-100">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="block text-slate-700 font-semibold uppercase text-sm tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              onClick={() => setMenuOpen(false)}
              className="block text-center px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold"
            >
              {isSignedIn ? `Hi, ${firstName ?? "there"}` : "Sign In"}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — poster style */}
      <section className="relative overflow-hidden">
        <div
          data-hero-blob="1"
          className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-pink-200/50 rounded-full blur-3xl pointer-events-none"
        />
        <div
          data-hero-blob="2"
          className="absolute top-1/4 -right-24 w-[26rem] h-[26rem] bg-purple-200/50 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10 relative">
          <div data-hero-badge className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest">
              {isSignedIn ? `Welcome back, ${firstName ?? "friend"}` : "Now Booking · Spring 2026"}
            </span>
          </div>

          <h1
            data-hero-title
            className="text-[14vw] sm:text-7xl md:text-8xl font-black leading-[0.92] tracking-tight"
          >
            <span className="block">Campus life,</span>
            <span className="block bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500  bg-clip-text text-transparent">
              all booked up.
            </span>
          </h1>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end mt-10">
            <p data-hero-text className="text-lg sm:text-xl text-slate-600 max-w-md leading-relaxed">
              Evently is the one stop for every club, every event, every RSVP —
              built so students show up and organizers never chase a spreadsheet again.
            </p>
            <div data-hero-buttons className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link
                href="/events"
                className="px-7 py-3.5 bg-slate-900 text-white rounded-full font-bold hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition flex items-center justify-center gap-2"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={organizeHref}
                className="px-7 py-3.5 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold hover:border-purple-500 hover:text-purple-600 transition text-center"
              >
                Organize an Event
              </Link>
            </div>
          </div>
        </div>

        {/* Ticket-stub stat card, rotated, overlapping the lineup strip below */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div
            data-ticket
            className="relative z-10 -mb-10 mt-4 sm:mt-0 max-w-sm bg-white rounded-2xl shadow-2xl shadow-purple-200/70 border border-slate-100 rotate-[-3deg] overflow-hidden"
          >
            <div className="flex">
              <div className="flex-1 p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-1">
                  Live right now
                </div>
                <div className="text-2xl font-black text-slate-900 mb-3">10K+ students active</div>
                <div className="flex -space-x-2.5">
                  {["from-pink-400 to-rose-400", "from-purple-400 to-fuchsia-400", "from-fuchsia-400 to-pink-400", "from-purple-500 to-violet-400"].map(
                    (grad, i) => (
                      <div
                        key={i}
                        className={`w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br ${grad}`}
                      />
                    )
                  )}
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                    +9K
                  </div>
                </div>
              </div>
              <div
                className="w-px my-4"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, transparent 4px, #e2e8f0 4px)",
                  backgroundSize: "100% 12px",
                }}
              />
              <div className="w-20 flex flex-col items-center justify-center bg-gradient-to-b from-pink-500 to-purple-600 text-white">
                <Sparkles className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold rotate-90 tracking-widest whitespace-nowrap">ADMIT ONE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LINEUP STRIP — happening now */}
      <section id="happening" className="bg-slate-900 pt-16 pb-14 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            On the lineup
          </h2>
          <span className="text-pink-300 text-sm font-bold uppercase tracking-widest hidden sm:block">
            Scroll →
          </span>
        </div>
        <div className="flex gap-5 px-5 sm:px-8 max-w-6xl mx-auto overflow-x-auto pb-2 [scrollbar-width:none]">
          {LINEUP.map((item) => (
            <div
              key={item.title}
              data-animate="pop"
              className="min-w-[240px] bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-pink-300 mb-3">
                {item.tag}
              </div>
              <div className="text-lg font-bold text-white mb-1">{item.title}</div>
              <div className="text-sm text-slate-400 mb-4">{item.note}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {item.when}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — asymmetric editorial grid */}
      <section id="how-it-works" className="py-24 bg-[#FBF9FC]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-500">What's inside</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3 leading-tight">
              Everything to manage
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> whole Event</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div
              data-animate="fade-up"
              className="md:row-span-2 bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-500  rounded-3xl p-8 flex flex-col justify-between min-h-[320px] text-white shadow-xl shadow-purple-200"
            >
              <Calendar className="w-10 h-10" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Build an event page in minutes</h3>
                <p className="text-pink-50">
                  Custom forms, schedules, and capacity caps — no spreadsheets, no copy-paste chaos.
                </p>
              </div>
            </div>

            <div
              data-animate="fade-up"
              className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-lg transition"
            >
              <CheckCircle className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">One-click registration</h3>
              <p className="text-slate-600 text-sm">Instant confirmation, calendar sync, zero friction.</p>
            </div>

            <div
              data-animate="fade-up"
              className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-lg transition"
            >
              <Users className="w-8 h-8 text-pink-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Real attendance data</h3>
              <p className="text-slate-600 text-sm">Live check-ins and analytics for every club leader.</p>
            </div>

            <div
              data-animate="fade-up"
              className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-lg transition flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Announcements that actually get read</h3>
                <p className="text-slate-600 text-sm">Push instant updates and reminders straight to attendees' inboxes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES — split panel */}
      <section id="roles" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-500">Two sides, one platform</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3">Built for everyone on campus</h2>
          </div>

          <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-xl shadow-purple-100 border border-slate-100">
            <div data-animate="fade-up" className="bg-white p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Students</h3>
              <p className="text-purple-500 font-semibold mb-6">Participant Dashboard</p>
              <ul className="space-y-4">
                {[
                  "Browse and register for upcoming events",
                  "View registration status and event details",
                  "Get instant announcements and updates",
                  "Track your event history and certificates",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-animate="fade-up" className="bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-500  p-10 text-white">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Club Leaders</h3>
              <p className="text-pink-100 font-semibold mb-6">Organizer Dashboard</p>
              <ul className="space-y-4">
                {[
                  "Create and customize event pages",
                  "Manage participant lists and check-ins",
                  "Send targeted announcements and reminders",
                  "Access analytics and attendance reports",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — poster banner */}
      <section className="py-24 bg-[#FBF9FC]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div
            data-animate="fade-up"
            className="relative rounded-3xl bg-slate-900 px-8 py-16 text-center overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <h2 className="relative text-4xl sm:text-5xl font-black text-white mb-4">
              Your next event starts
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> here.</span>
            </h2>
            <p className="relative text-slate-400 mb-8 max-w-md mx-auto">
              Join thousands of students and clubs already running campus life on Evently.
            </p>
            <Link
              href={primaryCtaHref}
              className="relative inline-flex items-center gap-2 px-9 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold hover:scale-105 transition transform"
            >
              {isSignedIn ? "Go to Dashboard" : "Get Started Free"} <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="relative mt-5 text-slate-500 text-sm">No credit card required · Free for students</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 text-slate-600 py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-white" />
                </span>
                <span className="text-xl font-black text-slate-900">Evently</span>
              </div>
              <p className="text-slate-500 mb-4 max-w-sm">
                The ultimate platform for managing student events and club activities. Built for the modern campus.
              </p>
              <div className="inline-block px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm border border-purple-100">
                Hackathon Demo Project
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                      className="hover:text-purple-600 transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Evently on X"
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white transition"
                >
                  <XIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Evently on LinkedIn"
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white transition"
                >
                  {/* <Linkedin className="w-5 h-5" /> */}
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Evently on GitHub"
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white transition"
                >
                  {/* <Github className="w-5 h-5" /> */}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Evently. Built with love for students everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}