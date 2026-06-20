import { useState, useCallback } from "react";
import { ArrowLeftRight, ChevronDown } from "lucide-react";

type Unit = { label: string; symbol: string };
type Category = {
  name: string;
  icon: string;
  units: Unit[];
  convert: (value: number, from: string, to: string) => number;
};

const categories: Category[] = [
  {
    name: "Температура",
    icon: "🌡",
    units: [
      { label: "Цельсий", symbol: "°C" },
      { label: "Фаренгейт", symbol: "°F" },
      { label: "Кельвин", symbol: "K" },
    ],
    convert(value, from, to) {
      let celsius = value;
      if (from === "°F") celsius = (value - 32) * 5 / 9;
      else if (from === "K") celsius = value - 273.15;
      if (to === "°C") return celsius;
      if (to === "°F") return celsius * 9 / 5 + 32;
      return celsius + 273.15;
    },
  },
  {
    name: "Длина",
    icon: "📏",
    units: [
      { label: "Метр", symbol: "м" },
      { label: "Километр", symbol: "км" },
      { label: "Сантиметр", symbol: "см" },
      { label: "Миллиметр", symbol: "мм" },
      { label: "Дюйм", symbol: "дюйм" },
      { label: "Фут", symbol: "фут" },
      { label: "Миля", symbol: "миля" },
    ],
    convert(value, from, to) {
      const toMeters: Record<string, number> = {
        "м": 1, "км": 1000, "см": 0.01, "мм": 0.001,
        "дюйм": 0.0254, "фут": 0.3048, "миля": 1609.344,
      };
      return value * toMeters[from] / toMeters[to];
    },
  },
  {
    name: "Масса",
    icon: "⚖️",
    units: [
      { label: "Килограмм", symbol: "кг" },
      { label: "Грамм", symbol: "г" },
      { label: "Миллиграмм", symbol: "мг" },
      { label: "Тонна", symbol: "т" },
      { label: "Фунт", symbol: "фунт" },
      { label: "Унция", symbol: "унция" },
    ],
    convert(value, from, to) {
      const toKg: Record<string, number> = {
        "кг": 1, "г": 0.001, "мг": 0.000001, "т": 1000,
        "фунт": 0.453592, "унция": 0.0283495,
      };
      return value * toKg[from] / toKg[to];
    },
  },
  {
    name: "Объём",
    icon: "🧪",
    units: [
      { label: "Литр", symbol: "л" },
      { label: "Миллилитр", symbol: "мл" },
      { label: "Кубометр", symbol: "м³" },
      { label: "Галлон (US)", symbol: "гал" },
      { label: "Пинта (US)", symbol: "пинта" },
    ],
    convert(value, from, to) {
      const toLiters: Record<string, number> = {
        "л": 1, "мл": 0.001, "м³": 1000, "гал": 3.78541, "пинта": 0.473176,
      };
      return value * toLiters[from] / toLiters[to];
    },
  },
  {
    name: "Скорость",
    icon: "💨",
    units: [
      { label: "м/с", symbol: "м/с" },
      { label: "км/ч", symbol: "км/ч" },
      { label: "миль/ч", symbol: "mph" },
      { label: "узлы", symbol: "уз" },
    ],
    convert(value, from, to) {
      const toMs: Record<string, number> = {
        "м/с": 1, "км/ч": 1 / 3.6, "mph": 0.44704, "уз": 0.514444,
      };
      return value * toMs[from] / toMs[to];
    },
  },
  {
    name: "Площадь",
    icon: "▭",
    units: [
      { label: "м²", symbol: "м²" },
      { label: "км²", symbol: "км²" },
      { label: "см²", symbol: "см²" },
      { label: "Гектар", symbol: "га" },
      { label: "Акр", symbol: "акр" },
      { label: "фут²", symbol: "фут²" },
    ],
    convert(value, from, to) {
      const toM2: Record<string, number> = {
        "м²": 1, "км²": 1e6, "см²": 0.0001, "га": 10000,
        "акр": 4046.856, "фут²": 0.092903,
      };
      return value * toM2[from] / toM2[to];
    },
  },
];

function formatResult(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) {
    return n.toExponential(4);
  }
  const str = n.toPrecision(7);
  return parseFloat(str).toString();
}

function UnitPicker({
  units,
  value,
  onChange,
}: {
  units: Unit[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = units.find((u) => u.symbol === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl border border-border text-foreground font-medium w-full justify-between transition-colors hover:bg-secondary/80"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <span>
          <span className="text-primary font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {current?.symbol}
          </span>
          <span className="text-muted-foreground text-sm ml-2">{current?.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {units.map((u) => (
            <button
              key={u.symbol}
              onClick={() => { onChange(u.symbol); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary ${
                u.symbol === value ? "bg-primary/10 text-primary" : "text-foreground"
              }`}
            >
              <span
                className="text-sm font-medium w-12 shrink-0"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: u.symbol === value ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                {u.symbol}
              </span>
              <span className="text-sm">{u.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [catIdx, setCatIdx] = useState(0);
  const [fromUnit, setFromUnit] = useState(categories[0].units[0].symbol);
  const [toUnit, setToUnit] = useState(categories[0].units[1].symbol);
  const [inputValue, setInputValue] = useState("1");

  const cat = categories[catIdx];

  const selectCategory = useCallback((idx: number) => {
    setCatIdx(idx);
    setFromUnit(categories[idx].units[0].symbol);
    setToUnit(categories[idx].units[1].symbol);
    setInputValue("1");
  }, []);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const numInput = parseFloat(inputValue);
  const result = isNaN(numInput)
    ? "—"
    : formatResult(cat.convert(numInput, fromUnit, toUnit));

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <header className="w-full max-w-md px-4 pt-10 pb-4">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Конвертер
        </p>
        <h1 className="text-2xl font-bold text-foreground">Единицы измерения</h1>
      </header>

      {/* Category tabs */}
      <div className="w-full max-w-md px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c, i) => (
            <button
              key={c.name}
              onClick={() => selectCategory(i)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                i === catIdx
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Converter card */}
      <div className="w-full max-w-md px-4 flex flex-col gap-4">

        {/* From */}
        <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
          <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Из
          </label>
          <UnitPicker units={cat.units} value={fromUnit} onChange={setFromUnit} />
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-secondary rounded-xl px-4 py-4 text-3xl font-semibold text-foreground outline-none border border-border focus:border-primary transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            placeholder="0"
            inputMode="decimal"
          />
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all text-sm font-medium"
          >
            <ArrowLeftRight size={15} />
            <span>Поменять</span>
          </button>
        </div>

        {/* To */}
        <div className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
          <label className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            В
          </label>
          <UnitPicker units={cat.units} value={toUnit} onChange={setToUnit} />
          <div
            className="w-full bg-muted rounded-xl px-4 py-4 text-3xl font-semibold"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: result === "—" ? "var(--muted-foreground)" : "var(--primary)",
            }}
          >
            {result}
          </div>
        </div>

        {/* Formula hint */}
        {!isNaN(numInput) && result !== "—" && (
          <div className="text-center text-sm text-muted-foreground pb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {numInput} {fromUnit} = {result} {toUnit}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 pb-6 text-center text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        PWA · {new Date().getFullYear()}
      </div>
    </div>
  );
}
