import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) {
    return n.toExponential(4);
  }
  return parseFloat(n.toPrecision(6)).toString();
}

function NumInput({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="decimal"
          placeholder="0"
          className="w-full bg-secondary rounded-xl px-4 py-4 pr-16 text-2xl font-semibold text-foreground outline-none border border-border focus:border-primary transition-colors"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

function ResultBox({ label, unit, value }: { label: string; unit: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {label}
      </span>
      <div className="relative w-full bg-muted rounded-xl px-4 py-4 pr-16">
        <span
          className="text-2xl font-semibold"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: value === "—" ? "var(--muted-foreground)" : "var(--primary)" }}
        >
          {value}
        </span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

function FormulaTag({ text }: { text: string }) {
  return (
    <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary inline-block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {text}
    </div>
  );
}

function SwapBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all text-xs font-medium self-center"
    >
      <ArrowUpDown size={13} />
      Поменять
    </button>
  );
}

// ── 1. Раз ↔ дБ ──────────────────────────────────────────────────────────────
function RazToDb() {
  const [dir, setDir] = useState<"raz2db" | "db2raz">("raz2db");
  const [val, setVal] = useState("10");

  const n = parseFloat(val);
  let result = "—";
  if (dir === "raz2db") {
    if (!isNaN(n) && n > 0) result = fmt(10 * Math.log10(n));
  } else {
    if (!isNaN(n)) result = fmt(Math.pow(10, n / 10));
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Раз ↔ дБ</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Коэффициент передачи мощности</p>
        </div>
        <SwapBtn onClick={() => setDir(d => d === "raz2db" ? "db2raz" : "raz2db")} />
      </div>
      {dir === "raz2db" ? (
        <>
          <FormulaTag text="dB = 10 · log₁₀(раз)" />
          <NumInput label="Раз" unit="×" value={val} onChange={setVal} />
          <ResultBox label="Результат" unit="дБ" value={result} />
        </>
      ) : (
        <>
          <FormulaTag text="раз = 10^(dB / 10)" />
          <NumInput label="дБ" unit="дБ" value={val} onChange={setVal} />
          <ResultBox label="Результат" unit="×" value={result} />
        </>
      )}
    </div>
  );
}

// ── 2. Вт ↔ дБм ──────────────────────────────────────────────────────────────
function WattToDbm() {
  const [dir, setDir] = useState<"w2dbm" | "dbm2w">("w2dbm");
  const [val, setVal] = useState("0.001");

  const n = parseFloat(val);
  let result = "—";
  if (dir === "w2dbm") {
    if (!isNaN(n) && n > 0) result = fmt(10 * Math.log10(n) + 30);
  } else {
    if (!isNaN(n)) result = fmt(Math.pow(10, (n - 30) / 10));
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Вт ↔ дБм</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Мощность сигнала</p>
        </div>
        <SwapBtn onClick={() => setDir(d => d === "w2dbm" ? "dbm2w" : "w2dbm")} />
      </div>
      {dir === "w2dbm" ? (
        <>
          <FormulaTag text="dBm = 10 · log₁₀(P) + 30" />
          <NumInput label="Мощность" unit="Вт" value={val} onChange={setVal} />
          <ResultBox label="Результат" unit="дБм" value={result} />
        </>
      ) : (
        <>
          <FormulaTag text="P = 10^((dBm − 30) / 10)" />
          <NumInput label="дБм" unit="дБм" value={val} onChange={setVal} />
          <ResultBox label="Результат" unit="Вт" value={result} />
        </>
      )}
    </div>
  );
}

// ── 3. Напряжение ↔ дБм ──────────────────────────────────────────────────────
function VoltToDbm() {
  const [dir, setDir] = useState<"v2dbm" | "dbm2v">("dbm2v");
  const [val, setVal] = useState("0");
  const [r, setR] = useState("50");

  const n = parseFloat(val);
  const rOhm = parseFloat(r);
  let result = "—";

  if (dir === "dbm2v") {
    // U = sqrt(P · R), P = 10^((dBm-30)/10)
    if (!isNaN(n) && !isNaN(rOhm) && rOhm > 0) {
      const p = Math.pow(10, (n - 30) / 10);
      result = fmt(Math.sqrt(p * rOhm));
    }
  } else {
    // dBm = 10·log10(U²/R) + 30
    if (!isNaN(n) && !isNaN(rOhm) && rOhm > 0 && n !== 0) {
      result = fmt(10 * Math.log10((n * n) / rOhm) + 30);
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Напряжение RMS ↔ дБм</h2>
          <p className="text-xs text-muted-foreground mt-0.5">С учётом импеданса</p>
        </div>
        <SwapBtn onClick={() => setDir(d => d === "dbm2v" ? "v2dbm" : "dbm2v")} />
      </div>
      {dir === "dbm2v" ? (
        <>
          <FormulaTag text="U = √(10^((dBm−30)/10) · R)" />
          <NumInput label="дБм" unit="дБм" value={val} onChange={setVal} />
        </>
      ) : (
        <>
          <FormulaTag text="dBm = 10 · log₁₀(U² / R) + 30" />
          <NumInput label="Напряжение RMS" unit="В" value={val} onChange={setVal} />
        </>
      )}
      {/* R field */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Импеданс R
        </span>
        <div className="relative">
          <input
            type="number"
            value={r}
            onChange={(e) => setR(e.target.value)}
            inputMode="decimal"
            placeholder="50"
            className="w-full bg-secondary rounded-xl px-4 py-3 pr-16 text-lg font-semibold text-foreground outline-none border border-border focus:border-primary/60 transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Ом
          </span>
        </div>
      </div>
      <ResultBox
        label="Результат"
        unit={dir === "dbm2v" ? "В" : "дБм"}
        value={result}
      />
    </div>
  );
}

const TABS = [
  { id: "raz", label: "Раз / дБ", Component: RazToDb },
  { id: "watt", label: "Вт / дБм", Component: WattToDbm },
  { id: "volt", label: "В / дБм", Component: VoltToDbm },
] as const;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<string>("raz");
  const { Component } = TABS.find((t) => t.id === active)!;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center bg-background pb-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="w-full max-w-md px-4 pt-10 pb-5">
        <p
          className="text-xs tracking-widest uppercase text-muted-foreground mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Конвертер
        </p>
        <h1 className="text-2xl font-bold text-foreground">Децибелы / дБм</h1>
      </header>

      {/* Tab bar */}
      <div className="w-full max-w-md px-4 mb-5">
        <div className="flex bg-secondary rounded-xl p-1 border border-border gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                t.id === active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md px-4">
        <Component />
      </div>

      <footer className="mt-8 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        dB · dBm · PWA
      </footer>
    </div>
  );
}
