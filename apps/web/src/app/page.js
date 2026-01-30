"use client";

import Navbar from "@/modules/home/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

function GlowBlob({ className }) {
  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute rounded-full blur-3xl opacity-40",
        className,
      ].join(" ")}
    />
  );
}

function GridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.12]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(56,189,248,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.14) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse at top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0) 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0) 78%)",
      }}
    />
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
      <div className="text-2xl md:text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(99,102,241,0.18),transparent_45%)]" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-cyan-300">
            {icon}
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/65">{desc}</p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300/90">
          <span className="opacity-80 group-hover:opacity-100 transition-opacity">
            Learn more
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Step({ n, title, desc }) {
  return (
    <motion.div variants={fadeUp} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="absolute -top-3 left-6 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/70">
        Step {n}
      </div>
      <h4 className="mt-2 text-base font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-white/65 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Testimonial({ quote, name, role }) {
  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm leading-relaxed text-white/70">“{quote}”</p>
      <div className="mt-4">
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-xs text-white/55">{role}</div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#070a10] text-white overflow-x-hidden">
      <Navbar />

      {/* Background */}
      <div className="relative">
        <GlowBlob className="left-[-120px] top-[-120px] h-[340px] w-[340px] bg-cyan-500/40" />
        <GlowBlob className="right-[-160px] top-[80px] h-[420px] w-[420px] bg-indigo-500/35" />
        <GlowBlob className="left-[35%] top-[520px] h-[520px] w-[520px] bg-sky-500/20" />
        <GridOverlay />

        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-24 md:pb-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Real-time multiplayer spaces • WebRTC voice/video • Avatars
              </div>

              <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
                Build, Explore, and{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                  Connect
                </span>{" "}
                in your Metaverse.
              </h1>

              <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-white/70">
                Create immersive spaces, invite friends, and interact instantly.
                Smooth movement, realtime chat, proximity-based calls, and a clean
                creator workflow—built for speed.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/spaces"
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition-all hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                >
                  Explore Spaces
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-white/90 transition-all hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/55">
                <span>• No downloads</span>
                <span>• Works in browser</span>
                <span>• Secure auth</span>
                <span>• Fast matchmaking</span>
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div variants={fadeUp} className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_120px_-40px_rgba(34,211,238,0.35)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.30),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.25),transparent_55%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white/90">Live Space Preview</div>
                    <div className="text-xs text-white/55">Status: Online</div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {["Lobby", "Arcade", "Studio", "Garden", "Gallery", "Hangout"].map((t) => (
                      <div
                        key={t}
                        className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-xs text-white/70"
                      >
                        <div className="font-medium text-white/85">{t}</div>
                        <div className="mt-1 text-[11px] text-white/50">Active</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>Realtime events</span>
                      <span className="text-cyan-300/90">~ 60 fps</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="text-[11px] text-white/55">Proximity</div>
                        <div className="text-sm font-semibold text-white/90">Smart</div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="text-[11px] text-white/55">Voice/Video</div>
                        <div className="text-sm font-semibold text-white/90">WebRTC</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <div className="text-xs text-white/60">
                      Players connected • chat streaming • movement synced
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute -z-10 inset-0 blur-2xl opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(56,189,248,0.35), transparent 55%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.28), transparent 55%)",
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mt-12 grid gap-4 md:grid-cols-3"
          >
            <motion.div variants={fadeUp}>
              <Stat label="Realtime movement sync" value="Low latency" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Stat label="Built for creators" value="Spaces + Avatars" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Stat label="Proximity chat/calls" value="Instant" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="relative mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                  A smoother, more modern{" "}
                  <span className="text-cyan-300">multiplayer experience</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm md:text-base text-white/65 leading-relaxed">
                  Everything is designed for speed: join spaces instantly, see movement
                  live, and start calls when nearby—without clutter.
                </p>
              </div>
            </motion.div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <FeatureCard
                title="Realtime Interaction"
                desc="See users move instantly with WebSocket-powered updates and clean client-side prediction."
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              <FeatureCard
                title="Custom Spaces"
                desc="Create and customize layouts with elements, themes, and rules—iterate fast."
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                }
              />
              <FeatureCard
                title="Avatar Identity"
                desc="Express yourself with animated avatars—your presence is felt in every space."
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
              />
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="relative mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                From zero to{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  live space
                </span>{" "}
                in minutes
              </h2>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-white/65">
                A simple flow with a premium feel—no clutter.
              </p>
            </motion.div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Step n={1} title="Create an account" desc="Pick an avatar and set your identity. You’re ready to explore." />
              <Step n={2} title="Enter a space" desc="Join public spaces or create your own. Movement and chat sync instantly." />
              <Step n={3} title="Connect nearby" desc="When users are close, start a call and collaborate in real time." />
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="relative mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                  Designed for{" "}
                  <span className="text-cyan-300">real</span> interactions
                </h2>
                <p className="mt-3 max-w-2xl text-sm md:text-base text-white/65">
                  Crisp UI, fast feedback, and multiplayer that feels immediate.
                </p>
              </div>
            </motion.div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Testimonial
                quote="Movement feels snappy and the UI is clean. It’s the first space app that doesn’t feel heavy."
                name="Community Builder"
                role="Early user"
              />
              <Testimonial
                quote="The proximity call feature makes collaboration feel natural—like walking up to someone."
                name="Product Designer"
                role="Creator"
              />
              <Testimonial
                quote="Joining spaces is instant. The interface feels premium and modern."
                name="Developer"
                role="Contributor"
              />
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="relative mx-auto max-w-6xl px-6 pb-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.2),transparent_55%)]" />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                Ready to enter the{" "}
                <span className="text-cyan-300">Metaverse</span>?
              </h2>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-white/65">
                Create an account, choose your avatar, and start building or exploring spaces.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-7 py-3.5 font-semibold text-black transition-all hover:bg-cyan-400"
                >
                  Get Started
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/spaces"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-7 py-3.5 font-semibold text-white/90 transition-all hover:bg-white/[0.06]"
                >
                  Browse Spaces
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 text-center text-xs text-white/45">
            © 2026 Metaverse Platform. All rights reserved.
          </div>
        </section>
      </div>
    </div>
  );
}
