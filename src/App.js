import { useState, useEffect, useCallback, useRef } from "react";

const COLS = 13,
  ROWS = 13,
  CELL = 42,
  ROAD = 2;

const LEVELS = [
  { label: "STARTER CITY", deliveries: 3, time: 90, enemies: 0, fog: false },
  { label: "INDUSTRIAL ZONE", deliveries: 4, time: 80, enemies: 1, fog: false },
  { label: "HARBOR DISTRICT", deliveries: 4, time: 75, enemies: 1, fog: false },
  { label: "TUNNEL NETWORK", deliveries: 5, time: 70, enemies: 2, fog: false },
  {
    label: "WAREHOUSE COMPLEX",
    deliveries: 5,
    time: 65,
    enemies: 2,
    fog: false,
  },
  { label: "FOG CITY", deliveries: 6, time: 65, enemies: 2, fog: false },
  { label: "DARK DISTRICT", deliveries: 6, time: 60, enemies: 3, fog: false },
  { label: "MAZE SECTOR", deliveries: 7, time: 55, enemies: 3, fog: false },
  {
    label: "CRITICAL INFRASTRUCTURE",
    deliveries: 8,
    time: 40,
    enemies: 4,
    fog: false,
    weapon: true,
  },
  {
    label: "KONNEX MAIN BASE",
    deliveries: 9,
    time: 45,
    enemies: 5,
    fog: false,
  },
];

const MAPS = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0],
    [0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 0],
    [0, 2, 2, 0, 2, 0, 0, 0, 2, 0, 2, 2, 0],
    [0, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 0],
    [0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0],
    [0, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0],
    [0, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 2, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

function getRoadCells(map) {
  const cells = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) if (map[r][c] === ROAD) cells.push({ r, c });
  return cells;
}
function randRoad(cells, excl = []) {
  const pool = cells.filter(
    (x) => !excl.some((e) => e.r === x.r && e.c === x.c)
  );
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : cells[0];
}
function dist(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}
function bldColor(r, c, l) {
  return ["#0d1a26", "#0a1520", "#111c2a", "#0c1e2d", "#0e1f30", "#0b1a28"][
    (r * 31 + c * 17 + l * 7) % 6
  ];
}

// ── Audio hook — tüm ses kodu React içinde, modül seviyesinde hiçbir şey yok ──
function useAudio() {
  const acRef = useRef(null);
  const bgRef = useRef(null); // interval id
  const mutRef = useRef(false);

  function getAC() {
    if (!acRef.current) {
      acRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (acRef.current.state === "suspended") acRef.current.resume();
    return acRef.current;
  }

  function tone(freq, type, dur, vol = 0.18, delay = 0) {
    if (mutRef.current) return;
    try {
      const ac = getAC();
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.connect(g);
      g.connect(ac.destination);
      osc.type = type;
      osc.frequency.value = freq;
      const t = ac.currentTime + delay;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (_) {}
  }

  function noise(dur, vol = 0.18) {
    if (mutRef.current) return;
    try {
      const ac = getAC();
      const len = Math.floor(ac.sampleRate * dur);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      const g = ac.createGain();
      const f = ac.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 500;
      src.buffer = buf;
      src.connect(f);
      f.connect(g);
      g.connect(ac.destination);
      g.gain.setValueAtTime(vol, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      src.start();
      src.stop(ac.currentTime + dur + 0.02);
    } catch (_) {}
  }

  function stopBg() {
    if (bgRef.current) {
      clearInterval(bgRef.current);
      bgRef.current = null;
    }
  }

  function startBg(lvlIdx) {
    stopBg();
    if (mutRef.current) return;
    try {
      const ac = getAC();
      const isFog = lvlIdx >= 5;
      const root = 110 * Math.pow(2, lvlIdx * 0.07);
      const scale = isFog
        ? [0, 3, 7, 10, 12, 15].map((s) => root * Math.pow(2, s / 12))
        : [0, 4, 7, 11, 12, 16].map((s) => root * Math.pow(2, s / 12));
      const ms = Math.max(200, 340 - lvlIdx * 14);
      const pattern = [0, 2, 4, 3, 1, 4, 2, 0, 1, 3, 5, 4, 2, 5, 3, 1];
      let step = 0;

      // master gain for bg music
      const bgGain = ac.createGain();
      bgGain.gain.value = 0.12;
      bgGain.connect(ac.destination);

      bgRef.current = setInterval(() => {
        if (mutRef.current) return;
        try {
          const freq = scale[pattern[step % pattern.length] % scale.length];
          const osc = ac.createOscillator();
          const g = ac.createGain();
          osc.connect(g);
          g.connect(bgGain);
          osc.type = isFog ? "sawtooth" : "triangle";
          osc.frequency.value = freq;
          const t = ac.currentTime;
          const dur = (ms / 1000) * 1.6;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(1, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
          osc.start(t);
          osc.stop(t + dur + 0.02);
          step++;
        } catch (_) {}
      }, ms);
    } catch (_) {}
  }

  function setMuted(val) {
    mutRef.current = val;
    if (val) stopBg();
  }

  const sfx = {
    move: () => tone(200, "square", 0.04, 0.03),
    pickup: () => {
      tone(440, "sine", 0.1, 0.18);
      setTimeout(() => tone(660, "sine", 0.12, 0.18), 80);
    },
    deliver: () =>
      [523, 659, 784, 1047].forEach((f, i) =>
        tone(f, "sine", 0.18, 0.18, i * 0.07)
      ),
    hit: () => {
      noise(0.2, 0.2);
      tone(90, "sawtooth", 0.25, 0.16);
    },
    win: () =>
      [523, 659, 784, 1047, 1319].forEach((f, i) =>
        tone(f, "sine", 0.24, 0.2, i * 0.1)
      ),
    lose: () =>
      [380, 280, 190, 100].forEach((f, i) =>
        tone(f, "sawtooth", 0.18, 0.14, i * 0.13)
      ),
    tick: () => tone(880, "square", 0.06, 0.1),
    start: () =>
      [262, 330, 392, 523].forEach((f, i) =>
        tone(f, "sine", 0.16, 0.14, i * 0.1)
      ),
  };

  // cleanup on unmount
  useEffect(
    () => () => {
      stopBg();
      try {
        if (acRef.current) acRef.current.close();
      } catch (_) {}
    },
    []
  );

  return { sfx, startBg, stopBg, setMuted };
}

// ── Konnex Bot SVG ────────────────────────────────────────────────────────────
function KonnexBot({ stunned, size = 30 }) {
  const glow = stunned ? "#f7258566" : "#00f5d466";
  const bodyFill = stunned ? "#f72585" : "#ffffff";
  const dotFill = stunned ? "#1a0010" : "#000000";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      style={{ filter: `drop-shadow(0 0 6px ${glow})`, display: "block" }}
    >
      {/* Ana gövde - çapraz yuvarlak dikdörtgen 1 */}
      <rect
        x="22"
        y="38"
        width="62"
        height="22"
        rx="11"
        ry="11"
        fill={bodyFill}
        transform="rotate(-20 50 50)"
      />
      {/* İkinci bağlantı çubuğu */}
      <rect
        x="22"
        y="38"
        width="56"
        height="20"
        rx="10"
        ry="10"
        fill={bodyFill}
        transform="rotate(20 50 50)"
      />
      {/* 4 uç top - beyaz dış */}
      <circle cx="22" cy="28" r="13" fill={bodyFill} />
      <circle cx="78" cy="72" r="13" fill={bodyFill} />
      <circle cx="25" cy="72" r="11" fill={bodyFill} />
      <circle cx="75" cy="28" r="11" fill={bodyFill} />
      {/* 4 uç top - siyah iç */}
      <circle cx="22" cy="28" r="6" fill={dotFill} />
      <circle cx="78" cy="72" r="6" fill={dotFill} />
      <circle cx="25" cy="72" r="5" fill={dotFill} />
      <circle cx="75" cy="28" r="5" fill={dotFill} />
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function KonnexDelivery() {
  const audio = useAudio();

  const [lvlIdx, setLvlIdx] = useState(0);
  const [phase, setPhase] = useState("menu");
  const [robotPos, setRobotPos] = useState({ r: 6, c: 6 });
  const [deliveries, setDeliveries] = useState([]);
  const [carrying, setCarrying] = useState(null);
  const [pickupPos, setPickupPos] = useState(null);
  const [multPickupPos, setMultPickupPos] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState(null);
  const [stunned, setStunned] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [multTimer, setMultTimer] = useState(0);
  const [bullets, setBullets] = useState([]);
  const [lastDir, setLastDir] = useState("up");

  const gameRef = useRef(null);
  const stRef = useRef(false);
  const carRef = useRef(null);
  const phRef = useRef("menu");
  const prevTime = useRef(90);
  const lvlRef = useRef(0);
  const multRef = useRef(1);
  const lastDirRef = useRef("up");
  const robotPosRef = useRef({ r: 6, c: 6 });

  useEffect(() => {
    stRef.current = stunned;
  }, [stunned]);
  useEffect(() => {
    carRef.current = carrying;
  }, [carrying]);
  useEffect(() => {
    phRef.current = phase;
  }, [phase]);
  useEffect(() => {
    lvlRef.current = lvlIdx;
  }, [lvlIdx]);
  useEffect(() => {
    multRef.current = multiplier;
  }, [multiplier]);
  useEffect(() => {
    robotPosRef.current = robotPos;
  }, [robotPos]);

  const lvl = LEVELS[lvlIdx];
  const map = MAPS[lvlIdx];

  const showFlash = useCallback((msg, color) => {
    setFlash({ msg, color });
    setTimeout(() => setFlash(null), 1500);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    audio.setMuted(next);
    if (!next && phRef.current === "playing") audio.startBg(lvlRef.current);
  }, [muted, audio]);

  // ── Start level ──
  const startLevel = useCallback(
    (idx) => {
      const l = LEVELS[idx];
      const m = MAPS[idx];
      const rc = getRoadCells(m);
      const mid = rc[Math.floor(rc.length / 2)];
      const used = [mid];

      const dels = Array.from({ length: l.deliveries }, (_, i) => {
        const pos = randRoad(rc, used);
        used.push(pos);
        return {
          id: i,
          pos,
          delivered: false,
          reward: 30 + idx * 8 + Math.floor(Math.random() * 40),
        };
      });
      const pickup = randRoad(rc, used);
      used.push(pickup);
      const multPickup = idx >= 3 ? randRoad(rc, used) : null;
      if (multPickup) used.push(multPickup);
      const enems = Array.from({ length: l.enemies }, (_, i) => {
        const pos = randRoad(rc, used);
        used.push(pos);
        return { id: i, pos, dir: ["up", "down", "left", "right"][i % 4] };
      });

      // Önce tüm state'leri set et, phase en sona gelsin
      setLvlIdx(idx);
      setRobotPos(mid);
      setCarrying(null);
      setScore(0);
      setStunned(false);
      setMultiplier(1);
      setMultTimer(0);
      setBullets([]);
      setLastDir("up");
      lastDirRef.current = "up";
      setTimeLeft(l.time);
      prevTime.current = l.time;
      setEnemies(enems);
      setPickupPos(pickup);
      setMultPickupPos(multPickup);
      setDeliveries(dels);
      // Phase son olarak değişsin - diğer state'ler hazır olsun
      setTimeout(() => setPhase("playing"), 0);
      audio.sfx.start();
      audio.startBg(idx);
      setTimeout(() => gameRef.current?.focus(), 80);
    },
    [audio]
  );

  // ── Timer ──
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        const next = s - 1;
        if (next <= 10) audio.sfx.tick();
        if (next <= 0) {
          setTimeout(() => {
            audio.stopBg();
            audio.sfx.lose();
            setPhase("levelover");
          }, 0);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, audio]);

  // ── All delivered ──
  useEffect(() => {
    if (phase !== "playing") return;
    if (deliveries.length > 0 && deliveries.every((d) => d.delivered)) {
      setTotal((ts) => ts + score);
      audio.stopBg();
      audio.sfx.win();
      setPhase("levelover");
    }
  }, [deliveries, phase, score, audio]);

  // ── Multiplier countdown ──
  useEffect(() => {
    if (multTimer <= 0) return;
    const t = setInterval(() => {
      setMultTimer((s) => {
        if (s <= 1) {
          setMultiplier(1);
          multRef.current = 1;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [multTimer]);

  // ── Enemy movement ──
  useEffect(() => {
    if (phase !== "playing" || lvl.enemies === 0) return;
    const ms = Math.max(280, 650 - lvlIdx * 38);
    const dirs = ["up", "down", "left", "right"];
    const delta = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
    const iv = setInterval(() => {
      const m = MAPS[lvlIdx];
      setEnemies((prev) =>
        prev.map((en) => {
          if (en.dead) return en;
          const dir =
            Math.random() < 0.35 ? dirs[Math.floor(Math.random() * 4)] : en.dir;
          const d = delta[dir];
          const nr = en.pos.r + d[0],
            nc = en.pos.c + d[1];
          if (
            nr >= 0 &&
            nr < ROWS &&
            nc >= 0 &&
            nc < COLS &&
            m[nr][nc] === ROAD
          )
            return { ...en, pos: { r: nr, c: nc }, dir };
          const valid = dirs.filter((vd) => {
            const [dr, dc] = delta[vd];
            const vr = en.pos.r + dr,
              vc = en.pos.c + dc;
            return (
              vr >= 0 && vr < ROWS && vc >= 0 && vc < COLS && m[vr][vc] === ROAD
            );
          });
          if (!valid.length) return en;
          const [dr, dc] =
            delta[valid[Math.floor(Math.random() * valid.length)]];
          return {
            ...en,
            pos: { r: en.pos.r + dr, c: en.pos.c + dc },
            dir: valid[0],
          };
        })
      );
    }, ms);
    return () => clearInterval(iv);
  }, [phase, lvlIdx, lvl.enemies]);

  // ── Collision ──
  useEffect(() => {
    if (phase !== "playing" || stRef.current) return;
    if (
      !enemies.some(
        (en) => en.pos.r === robotPos.r && en.pos.c === robotPos.c && !en.dead
      )
    )
      return;
    setStunned(true);
    setScore((s) => Math.max(0, s - 30));
    audio.sfx.hit();
    showFlash("⚡ COLLISION! −30 KNX · Stunned 2s", "#f72585");
    if (carRef.current) setCarrying(null);
    setTimeout(() => setStunned(false), 2000);
  }, [enemies, robotPos, phase, showFlash, audio]);

  // ── Move ──
  const shoot = useCallback(() => {
    if (phRef.current !== "playing") return;
    const pos = robotPosRef.current;
    const id = Date.now();
    setBullets((prev) => [
      ...prev,
      { id, pos: { ...pos }, dir: lastDirRef.current, alive: true },
    ]);
    // Ses
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.connect(g);
      g.connect(ac.destination);
      osc.type = "square";
      osc.frequency.value = 880;
      g.gain.setValueAtTime(0.15, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.08);
      osc.start();
      osc.stop(ac.currentTime + 0.1);
    } catch (_) {}
  }, []);

  const move = useCallback(
    (dir) => {
      if (phRef.current !== "playing" || stRef.current) return;
      lastDirRef.current = dir;
      setLastDir(dir);
      const delta = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }[
        dir
      ];
      const idx = lvlRef.current;

      setRobotPos((prev) => {
        const nr = prev.r + delta[0],
          nc = prev.c + delta[1];
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return prev;
        if (MAPS[idx][nr][nc] !== ROAD) return prev;
        audio.sfx.move();
        const np = { r: nr, c: nc };

        // 2x multiplier pickup
        setMultPickupPos((mp) => {
          if (mp && nr === mp.r && nc === mp.c) {
            setMultiplier(2);
            multRef.current = 2;
            setMultTimer(20);
            showFlash("⚡ 2x KNX ÇARPANI! 20 saniye!", "#ffd60a");
            audio.sfx.deliver();
            return null;
          }
          return mp;
        });

        // pickup
        setPickupPos((pp) => {
          if (!carRef.current && pp && nr === pp.r && nc === pp.c) {
            setDeliveries((ds) => {
              const t = ds.find((d) => !d.delivered);
              if (t) {
                setCarrying(t);
                audio.sfx.pickup();
                showFlash(`📦 Picked up! → Deliver to #${t.id + 1}`, "#ffd60a");
              }
              return ds;
            });
          }
          return pp;
        });

        // deliver
        if (
          carRef.current &&
          nr === carRef.current.pos.r &&
          nc === carRef.current.pos.c
        ) {
          const reward = carRef.current.reward * multRef.current;
          const cid = carRef.current.id;
          setScore((s) => s + reward);
          setCarrying(null);
          audio.sfx.deliver();
          setDeliveries((ds) => {
            const upd = ds.map((d) =>
              d.id === cid ? { ...d, delivered: true } : d
            );
            const next = upd.find((d) => !d.delivered);
            const rc2 = getRoadCells(MAPS[idx]);
            setPickupPos(next ? randRoad(rc2, [np, next.pos]) : null);
            showFlash(
              next
                ? `✅ Delivered! +${reward} KNX`
                : `🏆 Last delivery! +${reward} KNX`,
              "#00f5d4"
            );
            return upd;
          });
        }
        return np;
      });
    },
    [audio, showFlash]
  );

  // ── Bullet movement ──
  useEffect(() => {
    if (phase !== "playing" || bullets.length === 0) return;
    const iv = setInterval(() => {
      const delta = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
      setBullets((prev) => {
        const m = MAPS[lvlIdx];
        return prev
          .map((b) => {
            const [dr, dc] = delta[b.dir];
            const nr = b.pos.r + dr,
              nc = b.pos.c + dc;
            if (
              nr < 0 ||
              nr >= ROWS ||
              nc < 0 ||
              nc >= COLS ||
              m[nr][nc] !== ROAD
            )
              return { ...b, alive: false };
            return { ...b, pos: { r: nr, c: nc } };
          })
          .filter((b) => b.alive);
      });
    }, 120);
    return () => clearInterval(iv);
  }, [phase, lvlIdx, bullets.length]);

  // ── Bullet hit enemies ──
  useEffect(() => {
    if (phase !== "playing" || bullets.length === 0) return;
    setEnemies((prev) => {
      const hit = new Set();
      bullets.forEach((b) => {
        const idx = prev.findIndex(
          (en) => en.pos.r === b.pos.r && en.pos.c === b.pos.c && !en.dead
        );
        if (idx !== -1) hit.add(idx);
      });
      if (hit.size === 0) return prev;
      setBullets((bprev) =>
        bprev.filter(
          (b) =>
            !prev.some(
              (en, i) =>
                hit.has(i) && en.pos.r === b.pos.r && en.pos.c === b.pos.c
            )
        )
      );
      showFlash(`💥 Enemy down! +50 KNX`, "#00f5d4");
      setScore((s) => s + hit.size * 50);
      // Düşmanı dead=true yap, 5 sn sonra respawn
      const now = Date.now();
      return prev.map((en, i) =>
        hit.has(i) ? { ...en, dead: true, respawnAt: now + 10000 } : en
      );
    });
  }, [bullets, phase, lvlIdx, showFlash]);

  // ── Enemy respawn ──
  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(() => {
      const now = Date.now();
      setEnemies((prev) => {
        const hasDead = prev.some((en) => en.dead && now >= en.respawnAt);
        if (!hasDead) return prev;
        const m = MAPS[lvlIdx];
        const rc = [];
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            if (m[r][c] === ROAD) rc.push({ r, c });
        return prev.map((en) => {
          if (!en.dead || now < en.respawnAt) return en;
          const pos = rc[Math.floor(Math.random() * rc.length)];
          return { ...en, dead: false, respawnAt: undefined, pos };
        });
      });
    }, 500);
    return () => clearInterval(iv);
  }, [phase, lvlIdx]);

  // ── Keyboard ──
  useEffect(() => {
    const km = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const h = (e) => {
      if (km[e.key]) {
        e.preventDefault();
        move(km[e.key]);
      }
      if (e.key === " ") {
        e.preventDefault();
        shoot();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [move, shoot]);

  const fogR = lvl.fog ? 4 : 99;
  const see = (r, c) => dist(robotPos, { r, c }) <= fogR;
  const done = deliveries.filter((d) => d.delivered).length;
  const allDone = deliveries.length > 0 && deliveries.every((d) => d.delivered);
  const tColor =
    timeLeft <= 15 ? "#f72585" : timeLeft <= 30 ? "#ffd60a" : "#00f5d4";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#03070c",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New',monospace",
        color: "#e0f7fa",
        padding: "10px",
        userSelect: "none",
      }}
    >
      {/* BG grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(0,245,212,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,0.025) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Flash */}
      {flash && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "#03070c",
            border: `1px solid ${flash.color}`,
            borderRadius: 8,
            padding: "7px 16px",
            fontSize: 11,
            color: flash.color,
            fontWeight: 700,
            boxShadow: `0 0 16px ${flash.color}44`,
            whiteSpace: "nowrap",
            animation: "popIn .2s ease",
          }}
        >
          {flash.msg}
        </div>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 620,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <div>
            <div style={{ fontSize: 9, color: "#00f5d4", letterSpacing: 5 }}>
              ◈ KONNEX WORLD
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 2,
                color: "#fff",
              }}
            >
              ROBOTIC DELIVERY
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <button
              onClick={toggleMute}
              style={{
                width: 32,
                height: 32,
                background: "rgba(0,245,212,0.07)",
                border: "1px solid #0d3040",
                borderRadius: 7,
                color: muted ? "#f72585" : "#00f5d4",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <div style={{ display: "flex", gap: 3 }}>
              {LEVELS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 19,
                    height: 19,
                    borderRadius: 4,
                    fontSize: 7,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      i < lvlIdx
                        ? "#00f5d422"
                        : i === lvlIdx && phase === "playing"
                        ? "#00f5d4"
                        : "#0d2030",
                    color:
                      i < lvlIdx
                        ? "#00f5d4"
                        : i === lvlIdx && phase === "playing"
                        ? "#000"
                        : "#2a5a6a",
                    border: `1px solid ${
                      i <= lvlIdx ? "#00f5d433" : "#0d2030"
                    }`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HUD */}
        {phase === "playing" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {[
                { l: "LEVEL", v: `${lvlIdx + 1}/10`, c: "#a855f7" },
                { l: "KNX", v: score, c: "#00f5d4" },
                { l: "TOTAL", v: total + score, c: "#ffd60a" },
                { l: "DELIVERY", v: `${done}/${lvl.deliveries}`, c: "#f72585" },
              ].map((h) => (
                <div
                  key={h.l}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${h.c}22`,
                    borderRadius: 5,
                    padding: "2px 8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 7, color: h.c, letterSpacing: 2 }}>
                    {h.l}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: h.c }}>
                    {h.v}
                  </div>
                </div>
              ))}
              {lvl.fog && <HudBadge l="FOG" v="ON" c="#6b7280" />}
              {multiplier > 1 && (
                <HudBadge l="2x KNX" v={multTimer + "s"} c="#ffd60a" />
              )}
              <HudBadge l="WEAPON" v="[SPACE]" c="#a855f7" />
              {stunned && <HudBadge l="STUNNED" v="⚡" c="#f72585" />}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: tColor,
                textShadow: timeLeft <= 15 ? `0 0 12px ${tColor}` : "none",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏱ {timeLeft}s
            </div>
          </div>
        )}

        {/* Map */}
        <div
          ref={gameRef}
          tabIndex={0}
          style={{
            outline: "none",
            position: "relative",
            width: COLS * CELL,
            height: ROWS * CELL,
            margin: "0 auto",
            border: "2px solid #0d2d3a",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 0 32px rgba(0,245,212,0.07)",
            opacity: stunned ? 0.75 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {map.map((row, r) =>
            row.map((cell, c) => {
              const vis = see(r, c);
              const isBot =
                phase === "playing" && robotPos.r === r && robotPos.c === c;
              const isPkg =
                phase === "playing" &&
                vis &&
                !carrying &&
                pickupPos?.r === r &&
                pickupPos?.c === c;
              const isMult =
                phase === "playing" &&
                vis &&
                multPickupPos?.r === r &&
                multPickupPos?.c === c;
              const deliv = vis
                ? deliveries.find(
                    (d) => d.pos.r === r && d.pos.c === c && !d.delivered
                  )
                : null;
              const isTgt =
                phase === "playing" &&
                vis &&
                carrying?.pos.r === r &&
                carrying?.pos.c === c;
              const enemy =
                phase === "playing" &&
                enemies.find(
                  (en) => en.pos.r === r && en.pos.c === c && !en.dead
                );

              const isBlock = lvlIdx >= 6;
              const blockBorder =
                isBlock && cell !== ROAD && vis
                  ? "2px solid rgba(0,245,212,0.22)"
                  : "none";
              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    position: "absolute",
                    left: c * CELL,
                    top: r * CELL,
                    width: CELL,
                    height: CELL,
                    background: !vis
                      ? "#010508"
                      : cell === ROAD
                      ? "#07141e"
                      : bldColor(r, c, lvlIdx),
                    borderRight:
                      cell === ROAD ? "1px solid #091a24" : blockBorder,
                    borderBottom:
                      cell === ROAD ? "1px solid #091a24" : blockBorder,
                    borderLeft: blockBorder,
                    borderTop: blockBorder,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {vis && cell !== ROAD && !isBlock && (
                    <div
                      style={{
                        width: "60%",
                        height: "60%",
                        background: "rgba(0,245,212,0.03)",
                        border: "1px solid rgba(0,245,212,0.06)",
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {vis && cell !== ROAD && isBlock && (
                    <div
                      style={{
                        width: "88%",
                        height: "88%",
                        background: "rgba(0,245,212,0.08)",
                        borderRadius: 0,
                      }}
                    />
                  )}
                  {vis &&
                    cell === ROAD &&
                    !isBot &&
                    !isPkg &&
                    !deliv &&
                    !isTgt &&
                    !enemy && (
                      <div
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          background: "rgba(0,245,212,0.1)",
                        }}
                      />
                    )}
                  {isPkg && (
                    <div
                      style={{
                        fontSize: 18,
                        animation: "pulse .8s infinite",
                        filter: "drop-shadow(0 0 5px #ffd60a)",
                      }}
                    >
                      📦
                    </div>
                  )}
                  {isMult && (
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: "#ffd60a",
                        animation: "pulse .6s infinite",
                        filter: "drop-shadow(0 0 8px #ffd60a)",
                        textAlign: "center",
                        lineHeight: 1.1,
                      }}
                    >
                      ⚡<br />
                      2x
                    </div>
                  )}
                  {deliv && !isTgt && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14 }}>🏠</div>
                      <div
                        style={{
                          fontSize: 7,
                          color: "#f72585",
                          fontWeight: 900,
                        }}
                      >
                        {deliv.reward}
                      </div>
                    </div>
                  )}
                  {isTgt && (
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 14,
                          animation: "pulse .5s infinite",
                        }}
                      >
                        🎯
                      </div>
                      <div
                        style={{
                          fontSize: 7,
                          color: "#00f5d4",
                          fontWeight: 900,
                          animation: "pulse .5s infinite",
                        }}
                      >
                        {carrying?.reward}
                      </div>
                    </div>
                  )}
                  {enemy && vis && (
                    <div
                      style={{
                        width: CELL - 10,
                        height: CELL - 10,
                        background: "rgba(247,37,133,0.15)",
                        border: "2px solid #f72585",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        boxShadow: "0 0 10px #f7258555",
                        animation: "enemyPulse 1s infinite",
                      }}
                    >
                      🚨
                    </div>
                  )}
                  {!enemy &&
                    vis &&
                    enemies.some(
                      (en) => en.dead && en.pos.r === r && en.pos.c === c
                    ) && (
                      <div
                        style={{
                          width: CELL - 14,
                          height: CELL - 14,
                          border: "1px dashed #f7258566",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "#f7258588",
                        }}
                      >
                        💀
                      </div>
                    )}
                  {bullets.some((b) => b.pos.r === r && b.pos.c === c) && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#ffd60a",
                        boxShadow: "0 0 8px #ffd60a",
                        zIndex: 8,
                        position: "absolute",
                      }}
                    />
                  )}
                  {isBot && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        zIndex: 10,
                        position: "relative",
                        animation: stunned ? "shake .3s infinite" : "none",
                      }}
                    >
                      <KonnexBot stunned={stunned} size={28} />
                      {carrying && (
                        <div
                          style={{
                            fontSize: 6,
                            color: "#ffd60a",
                            fontWeight: 900,
                            background: "rgba(255,214,10,0.12)",
                            borderRadius: 2,
                            padding: "0 3px",
                            border: "1px solid #ffd60a44",
                            lineHeight: 1.5,
                          }}
                        >
                          PKG
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Fog */}
          {lvl.fog && phase === "playing" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 5,
                background: `radial-gradient(circle ${fogR * CELL}px at ${
                  robotPos.c * CELL + CELL / 2
                }px ${
                  robotPos.r * CELL + CELL / 2
                }px, transparent 55%, rgba(3,7,12,0.9) 100%)`,
              }}
            />
          )}

          {/* Overlays */}
          {(phase === "menu" || phase === "levelover") && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(3,7,12,0.94)",
                backdropFilter: "blur(6px)",
                borderRadius: 6,
              }}
            >
              {phase === "menu" && (
                <>
                  <KonnexBot size={46} />
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: 3,
                      marginTop: 10,
                      marginBottom: 6,
                    }}
                  >
                    ROBOTIC DELIVERY
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#7eb8c9",
                      textAlign: "center",
                      lineHeight: 1.9,
                      marginBottom: 20,
                    }}
                  >
                    10 levels · increasing difficulty
                    <br />
                    📦 Pick up → 🏠 Deliver · 🚨 Avoid enemies
                    <br />⛅ Fog starts level 6 · 🔊 Web Audio music
                  </div>
                  <button
                    onClick={() => startLevel(0)}
                    style={btnSt("#00f5d4")}
                  >
                    ▶ START GAME
                  </button>
                </>
              )}
              {phase === "levelover" && (
                <>
                  <div style={{ fontSize: 38, marginBottom: 8 }}>
                    {allDone ? "🏆" : "⏱"}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      letterSpacing: 3,
                      color: allDone ? "#00f5d4" : "#ffd60a",
                      marginBottom: 6,
                    }}
                  >
                    {allDone ? `LEVEL ${lvlIdx + 1} COMPLETE!` : "TIME'S UP"}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#7eb8c9", marginBottom: 4 }}
                  >
                    {done}/{lvl.deliveries} deliveries · {score} KNX
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#ffd60a",
                      marginBottom: 20,
                    }}
                  >
                    Total: {total} KNX
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {lvlIdx < 9 && allDone && (
                      <button
                        onClick={() => startLevel(lvlIdx + 1)}
                        style={btnSt("#00f5d4")}
                      >
                        NEXT LEVEL →
                      </button>
                    )}
                    <button
                      onClick={() => startLevel(lvlIdx)}
                      style={btnSt("#ffd60a")}
                    >
                      ↩ RETRY
                    </button>
                    {lvlIdx === 9 && allDone && (
                      <button
                        onClick={() => {
                          setTotal(0);
                          startLevel(0);
                        }}
                        style={btnSt("#a855f7")}
                      >
                        🏆 PLAY AGAIN
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* D-pad */}
        {phase === "playing" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <button onClick={() => move("up")} style={arrowBt}>
                ▲
              </button>
              <div style={{ display: "flex", gap: 3 }}>
                <button onClick={() => move("left")} style={arrowBt}>
                  ◀
                </button>
                <button onClick={() => move("down")} style={arrowBt}>
                  ▼
                </button>
                <button onClick={() => move("right")} style={arrowBt}>
                  ▶
                </button>
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#1a4a5a",
                  marginTop: 2,
                  letterSpacing: 1,
                }}
              >
                WASD / ARROW KEYS
              </div>
            </div>
            <button
              onClick={shoot}
              style={{
                padding: "10px 16px",
                background: "rgba(168,85,247,0.12)",
                border: "1px solid #a855f7",
                borderRadius: 7,
                color: "#a855f7",
                fontSize: 10,
                fontWeight: 900,
                cursor: "pointer",
                letterSpacing: 1,
                lineHeight: 1.5,
              }}
            >
              💥 FIRE
              <br />
              <span style={{ fontSize: 8, opacity: 0.7 }}>SPACE</span>
            </button>
          </div>
        )}

        {/* Badges */}
        {phase === "playing" && (
          <div
            style={{
              marginTop: 7,
              display: "flex",
              gap: 5,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Badge c="#7eb8c9">{lvl.label}</Badge>
            {!carrying && pickupPos && (
              <Badge c="#ffd60a">📦 Find the package</Badge>
            )}
            {carrying && (
              <Badge c="#00f5d4">
                🎯 Address #{carrying.id + 1} · +{carrying.reward * multiplier}{" "}
                KNX{multiplier > 1 ? " ⚡2x" : ""}
              </Badge>
            )}
            {lvl.enemies > 0 && (
              <Badge c="#f72585">
                🚨 {lvl.enemies} enemy robot{lvl.enemies > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: 10,
            textAlign: "center",
            fontSize: 8,
            color: "#0d2030",
            letterSpacing: 3,
          }}
        >
          KONNEX WORLD · PROOF-OF-PHYSICAL-WORK · 10 LEVELS
        </div>
      </div>

      <style>{`
        @keyframes pulse       { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes enemyPulse  { 0%,100%{box-shadow:0 0 8px #f7258555} 50%{box-shadow:0 0 18px #f72585bb} }
        @keyframes shake       { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
        @keyframes popIn       { from{opacity:0;transform:translateX(-50%) scale(.8)} to{opacity:1;transform:translateX(-50%) scale(1)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const arrowBt = {
  width: 40,
  height: 40,
  background: "rgba(0,245,212,0.07)",
  border: "1px solid #0d3040",
  borderRadius: 7,
  color: "#00f5d4",
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
function btnSt(c) {
  return {
    padding: "10px 24px",
    background: `${c}18`,
    border: `1px solid ${c}`,
    borderRadius: 8,
    color: c,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: `0 0 16px ${c}22`,
  };
}
function HudBadge({ l, v, c }) {
  return (
    <div
      style={{
        background: `${c}11`,
        border: `1px solid ${c}44`,
        borderRadius: 5,
        padding: "2px 8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 7, color: c, letterSpacing: 2 }}>{l}</div>
      <div style={{ fontSize: 11, fontWeight: 900, color: c }}>{v}</div>
    </div>
  );
}
function Badge({ c, children }) {
  return (
    <div
      style={{
        background: `${c}11`,
        border: `1px solid ${c}44`,
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 10,
        color: c,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}
