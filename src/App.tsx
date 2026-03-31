import { useEffect, useState, useRef } from "react";

type CustomDate = {
  year: number;
  month: number;
  day: number;
  weekDay: number;
};

const START_DATE = new Date(547, 0, 1); // початок відліку - 1 січня 547 року (рік освячення Сан Вітале)

// Функція для обчислення CustomDate з Date
function calculateCustomDate(date: Date): CustomDate {
  const days = Math.floor((date.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));

  const year = Math.floor(days / 360) + 1;
  const dayOfYear = ((days % 360) + 360) % 360;

  const month = Math.floor(dayOfYear / 72) + 1;
  const day = (dayOfYear % 72) + 1;
  const weekDay = (dayOfYear % 8) + 1;

  return { year, month, day, weekDay };
}

function CalendarGrid({ currentDay }: { currentDay: number }) {
  return (
    <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(2rem,1fr))]">
      {Array.from({ length: 72 }, (_, i) => {
        const d = i + 1;
        const active = d === currentDay;
        return (
          <div
            key={d}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition
              ${active
                ? "bg-indigo-400 text-black font-bold scale-110"
                : "bg-white/10 hover:bg-white/20"}`}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState<string>("");

  // Джерело правди для сьогоднішнього часу
  //const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [today, setToday] = useState<CustomDate>(calculateCustomDate(new Date()));

  // Для конвертера, оновлюється тільки при Convert
  const [converted, setConverted] = useState<CustomDate | null>(null);

  const [time, setTime] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [forceBelow, setForceBelow] = useState(false);

  // Таймер для сьогоднішнього часу (календар + час)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      //setCurrentDate(now);
      setToday(calculateCustomDate(now));

      const t = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(t);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Обчислення, чи переносити результат вниз
  const updateLayout = () => {
    if (containerRef.current && resultRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const inputWidth = containerRef.current.querySelector("input")?.clientWidth || 0;
      const gap = 16;
      const resultWidth = resultRef.current.offsetWidth;
      setForceBelow(resultWidth + gap > containerWidth - inputWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateLayout);
    updateLayout();
    return () => window.removeEventListener("resize", updateLayout);
  }, [converted]);

  // Конвертер
  const handleConvert = () => {
    if (!input) return;
    const d = new Date(input); // локальний час користувача
    const conv = calculateCustomDate(d);
    setConverted(conv);
    setTimeout(updateLayout, 10);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900 to-black" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,white,transparent)]" />
      </div>

      <div className="p-10 grid gap-10 md:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-8">

          {/* TITLE */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6">
            <h1 className="text-3xl font-bold mb-4">OctaChron</h1>
            <p className="opacity-80">
              Time is not a line. It flows along facets and edges.
            </p>
          </div>

          {/* LEGEND */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 space-y-4">
            <p>
              In 547, in Ravenna, the Basilica of San Vitale was consecrated — a structure whose form defied conventional order. Its heart, an octagon, seemed neither of earth nor heaven, standing between the two realms.
            </p>
            <p>
              At that time, the number seven symbolized completeness, the wholeness of the world. But the eighth day is not a continuation — it is a new beginning. Something beyond linear time, something angular, returning to itself.
            </p>
            <p>
              Our calendar is born from this idea. It does not measure time linearly; it perceives it as angular, a rhythm of facets, where every step leads back and forward at once.
            </p>
            <p>
              A day here is more than a day — it is part of an octagonal cadence, where repetitions occur, and endings become beginnings. Each facet opens a new perspective: observe how time dances along its edges, as ancient architects intended, capturing the eternal angular cycle in stone.
            </p>
            <p>
              From today to tomorrow, from one cycle to another, your journey in <strong>OctaChron</strong> is a passage through space and time, where everything repeats, yet never remains the same.
            </p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* CALENDAR */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl">Today</h2>
                <p className="opacity-70">
                  Year {today.year} • Month {today.month}
                </p>
              </div>

              <div className="text-right font-mono text-lg">
                {time}
              </div>
            </div>

            <CalendarGrid currentDay={today.day} />
          </div>

          {/* CONVERTER */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 flex flex-col" ref={containerRef}>
            <h2 className="text-xl mb-4">Convert date</h2>
            <div
              className={`flex gap-4 flex-wrap`}
              style={{ flexDirection: forceBelow ? "column" : "row" }}
            >
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="date"
                  className="bg-white/10 text-white p-2 rounded border border-white/20"
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  onClick={handleConvert}
                  className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-400"
                >
                  Convert
                </button>
              </div>

              {converted && (
                <div
                  ref={resultRef}
                  className={`bg-white/10 p-4 rounded-xl border border-white/20 flex-shrink-0`}
                  style={{
                    width: forceBelow ? "100%" : "auto",
                    marginTop: forceBelow ? "0.5rem" : "0",
                  }}
                >
                  <p className="opacity-80 mb-2">
                    Year {converted.year} • Month {converted.month}
                  </p>
                  <p className="text-sm opacity-70">
                    Day {converted.day} • Weekday {converted.weekDay}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}