"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
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

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-sm md:text-base text-white/65 leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_90px_-40px_rgba(34,211,238,0.22)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="text-2xl md:text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-1 text-sm text-white/65 leading-relaxed">{desc}</div>
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/80">
      <code>{children}</code>
    </pre>
  );
}

function AnchorNav() {
  const items = [
    { href: "#demo", label: "Demo" },
    { href: "#features", label: "Features" },
    { href: "#architecture", label: "Architecture" },
    { href: "#tech", label: "Tech Stack" },
    { href: "#security", label: "Security" },
    { href: "#multiplayer", label: "Multiplayer Flow" },
    { href: "#run", label: "Run Locally" },
    { href: "#roadmap", label: "Roadmap" },
    { href: "#author", label: "Author" },
  ];

  return (
    <div className="sticky top-4 hidden lg:block">
      <Card className="p-4">
        <div className="text-xs font-semibold text-white/80">On this page</div>
        <div className="mt-3 grid gap-2">
          {items.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="text-sm text-white/65 hover:text-cyan-300 transition-colors"
            >
              {i.label}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070a10] text-white overflow-x-hidden">
      {/* Background */}
      <div className="relative">
        <GlowBlob className="left-[-140px] top-[-120px] h-[360px] w-[360px] bg-cyan-500/40" />
        <GlowBlob className="right-[-180px] top-[60px] h-[440px] w-[440px] bg-indigo-500/35" />
        <GlowBlob className="left-[30%] top-[620px] h-[520px] w-[520px] bg-sky-500/20" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(56,189,248,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.14) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0) 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0) 78%)",
          }}
        />

        <main className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            {/* Header */}
            <motion.div variants={fadeUp} className="flex items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Pill>Realtime WebSockets</Pill>
                  <Pill>Phaser 3</Pill>
                  <Pill>WebRTC 1:1</Pill>
                  <Pill>Next.js App Router</Pill>
                </div>

                <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight leading-[1.08]">
                  HangoutX —{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                    Metaverse 2D Multiplayer Platform
                  </span>
                </h1>

                <p className="mt-4 max-w-3xl text-sm md:text-base text-white/70 leading-relaxed">
                  A real-time 2D multiplayer metaverse inspired by Gather, Zep, and Spatial.
                  Walk around spaces, see others moving instantly, chat, and start 1–1 WebRTC video calls
                  with nearby players.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.hangoutx.space/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition-all hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                  >
                    Open Web App <span className="ml-2">→</span>
                  </a>
                  <a
                    href="https://api.hangoutx.space"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-white/90 transition-all hover:bg-white/[0.06]"
                  >
                    Backend API
                  </a>
                  <a
                    href="wss://ws.hangoutx.space"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-white/90 transition-all hover:bg-white/[0.06]"
                  >
                    WebSocket Server
                  </a>
                </div>

                <div className="mt-6 text-xs text-white/55">
                  Tip: Use the demo links above to verify HTTP + WS are live.
                </div>
              </div>

              <div className="hidden md:block">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/90 transition-all hover:bg-white/[0.06]"
                >
                  ← Back to Home
                </Link>
              </div>
            </motion.div>

            {/* Content grid */}
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
              <motion.div variants={stagger} className="grid gap-10">
                {/* Demo */}
                <motion.div variants={fadeUp}>
                  <Section
                    id="demo"
                    title="Demo"
                    subtitle="Deployed frontend + backend + realtime server."
                  >
                    <Card className="p-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <a
                          className="rounded-2xl border border-white/10 bg-black/20 p-5 hover:border-cyan-500/40 transition-colors"
                          href="https://www.hangoutx.space/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="text-sm font-semibold">Web App</div>
                          <div className="mt-1 text-xs text-white/60">https://www.hangoutx.space/</div>
                        </a>
                        <a
                          className="rounded-2xl border border-white/10 bg-black/20 p-5 hover:border-cyan-500/40 transition-colors"
                          href="https://api.hangoutx.space"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="text-sm font-semibold">Backend API</div>
                          <div className="mt-1 text-xs text-white/60">https://api.hangoutx.space</div>
                        </a>
                        <a
                          className="rounded-2xl border border-white/10 bg-black/20 p-5 hover:border-cyan-500/40 transition-colors"
                          href="wss://ws.hangoutx.space"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="text-sm font-semibold">WebSocket</div>
                          <div className="mt-1 text-xs text-white/60">wss://ws.hangoutx.space</div>
                        </a>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <Stat label="Engine" value="Phaser 3" />
                        <Stat label="Realtime" value="WebSockets" />
                        <Stat label="Calls" value="WebRTC 1:1" />
                      </div>
                    </Card>
                  </Section>
                </motion.div>

                {/* Features */}
                <motion.div variants={fadeUp}>
                  <Section
                    id="features"
                    title="What is this?"
                    subtitle="A realtime 2D multiplayer platform built from scratch with modern full-stack + realtime architecture."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Feature
                        title="Authentication & Accounts"
                        desc="JWT auth, bcrypt password hashing, protected routes, persistent login via tokens."
                      />
                      <Feature
                        title="Spaces (Rooms)"
                        desc="Create/join spaces with width/height, tilemaps, collision grids, and isolated multiplayer rooms."
                      />
                      <Feature
                        title="Multiplayer Core"
                        desc="Server-authoritative movement, room broadcasts on join/move/leave, and realtime sync via WebSockets."
                      />
                      <Feature
                        title="1–1 Nearby Video Calls"
                        desc="When players are close, start a direct peer-to-peer WebRTC call (offer/answer/ICE relayed via WS)."
                      />
                      <Feature
                        title="Avatars"
                        desc="Avatar fetched from DB on join and synced to all players in the room."
                      />
                      <Feature
                        title="Admin System"
                        desc="Admins can create maps, create elements, and control world layout."
                      />
                    </div>
                  </Section>
                </motion.div>

                {/* Architecture */}
                <motion.div variants={fadeUp}>
                  <Section
                    id="architecture"
                    title="Architecture"
                    subtitle="Monorepo structure with separate web/http/ws apps and a shared Prisma DB package."
                  >
                    <Card className="p-6">
                      <CodeBlock>{`metaverse-repo/
├── apps/
│  ├── web/     (Next.js frontend)
│  ├── http/    (Express REST API)
│  └── ws/      (WebSocket realtime server)
│
├── packages/
│  └── db/      (Prisma + DB client)`}</CodeBlock>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <Feature
                          title="Web"
                          desc="Next.js (App Router), Tailwind UI, Phaser rendering, WebRTC calls."
                        />
                        <Feature
                          title="HTTP API"
                          desc="Express + Prisma + Postgres for auth, spaces, admin tools, CRUD."
                        />
                        <Feature
                          title="WS Server"
                          desc="Room manager, JWT verification, server-authoritative movement, WebRTC signaling relay."
                        />
                      </div>
                    </Card>
                  </Section>
                </motion.div>

                {/* Tech Stack */}
                <motion.div variants={fadeUp}>
                  <Section id="tech" title="Tech Stack" subtitle="Modern full-stack choices optimized for realtime systems.">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="p-6">
                        <div className="text-sm font-semibold">Frontend</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill>Next.js 16</Pill>
                          <Pill>React</Pill>
                          <Pill>Tailwind CSS</Pill>
                          <Pill>Phaser 3</Pill>
                          <Pill>Axios</Pill>
                          <Pill>Zod</Pill>
                          <Pill>React Query</Pill>
                        </div>
                      </Card>
                      <Card className="p-6">
                        <div className="text-sm font-semibold">Backend</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill>Node.js</Pill>
                          <Pill>Express</Pill>
                          <Pill>Prisma</Pill>
                          <Pill>PostgreSQL (Neon)</Pill>
                          <Pill>JWT</Pill>
                          <Pill>bcrypt</Pill>
                          <Pill>ws</Pill>
                        </div>
                      </Card>
                      <Card className="p-6 md:col-span-2">
                        <div className="text-sm font-semibold">Infra</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill>Turborepo</Pill>
                          <Pill>Vercel (Web)</Pill>
                          <Pill>Render (HTTP + WS)</Pill>
                          <Pill>GitHub</Pill>
                        </div>
                      </Card>
                    </div>
                  </Section>
                </motion.div>

                {/* Security */}
                <motion.div variants={fadeUp}>
                  <Section id="security" title="Security" subtitle="Baseline security for realtime multiplayer apps.">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Feature title="Password hashing" desc="bcrypt hashing for stored passwords." />
                      <Feature title="JWT authentication" desc="JWT verification on HTTP routes and WS join." />
                      <Feature title="Server-authoritative movement" desc="Prevents client-side cheating by validating moves on server." />
                      <Feature title="Room isolation" desc="Messages broadcast only within the active space/room." />
                    </div>
                  </Section>
                </motion.div>

                {/* Multiplayer flow */}
                <motion.div variants={fadeUp}>
                  <Section
                    id="multiplayer"
                    title="How Multiplayer Works (High Level)"
                    subtitle="The client connects to WS, joins a space with a JWT, and then sends validated move events."
                  >
                    <Card className="p-6">
                      <div className="grid gap-6">
                        <div>
                          <div className="text-sm font-semibold text-white/90">Join</div>
                          <div className="mt-2">
                            <CodeBlock>{`{
  "type": "join",
  "payload": {
    "spaceId": "...",
    "token": "JWT"
  }
}`}</CodeBlock>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-white/90">Move</div>
                          <div className="mt-2">
                            <CodeBlock>{`{
  "type": "move",
  "payload": { "x": 64, "y": 128 }
}`}</CodeBlock>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <Feature title="Server validates" desc="Only 32px step moves allowed; invalid moves are rejected." />
                          <Feature title="Broadcast to room" desc="Movement updates are broadcast to all users in the same space." />
                          <Feature title="Presence events" desc="Join/leave triggers immediate updates to other clients." />
                        </div>
                      </div>
                    </Card>
                  </Section>
                </motion.div>

                {/* Run locally */}
                <motion.div variants={fadeUp}>
                  <Section id="run" title="How to Run Locally" subtitle="Clone, install dependencies, set env, run dev.">
                    <Card className="p-6">
                      <div className="grid gap-5">
                        <div>
                          <div className="text-sm font-semibold">1) Clone</div>
                          <div className="mt-2">
                            <CodeBlock>{`git clone https://github.com/your-username/metaverse-repo.git
cd metaverse-repo`}</CodeBlock>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">2) Install</div>
                          <div className="mt-2">
                            <CodeBlock>{`npm install`}</CodeBlock>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">3) Setup env</div>
                          <div className="mt-2 text-sm text-white/65">
                            Create <span className="font-mono text-white/85">.env</span> in:
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Pill>apps/http</Pill>
                              <Pill>apps/ws</Pill>
                              <Pill>packages/db</Pill>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">4) Run</div>
                          <div className="mt-2">
                            <CodeBlock>{`npm run dev`}</CodeBlock>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Section>
                </motion.div>

                {/* Roadmap */}
                <motion.div variants={fadeUp}>
                  <Section id="roadmap" title="Future Updates (Roadmap)" subtitle="Planned features to expand the platform.">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Feature title="Multiple Maps" desc="Themes, map selector, teleport between worlds." />
                      <Feature title="Custom Avatars" desc="Avatar editor, skins, and uploads." />
                      <Feature title="Private Rooms" desc="Invite-only spaces, passwords, team rooms." />
                      <Feature title="Interactions" desc="Object interactions, doors, chairs, mini-games." />
                      <Feature title="Mobile Support" desc="Touch controls, responsive UI, PWA." />
                      <Feature title="Infra improvements" desc="Observability, scaling WS rooms, rate limits." />
                    </div>
                  </Section>
                </motion.div>

                {/* Author */}
                <motion.div variants={fadeUp}>
                  <Section id="author" title="Author" subtitle="Built and maintained by:">
                    <Card className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold">Hussain Taher Kagalwala</div>
                          <div className="mt-1 text-sm text-white/65">
                            BITS Pilani, Hyderabad Campus
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <a
                            href="https://www.hangoutx.space/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-black hover:bg-cyan-400 transition-colors"
                          >
                            Open Demo
                          </a>
                          <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-5 py-2.5 font-semibold text-white/90 hover:bg-white/[0.06] transition-colors"
                          >
                            Home
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </Section>
                </motion.div>

                <motion.div variants={fadeUp} className="pt-6 text-center text-xs text-white/45">
                  © {new Date().getFullYear()} HangoutX. All rights reserved.
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <AnchorNav />
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}