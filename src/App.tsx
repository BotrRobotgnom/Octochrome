import { useEffect, useState } from "react";

type CustomDate = {
  year: number;
  month: number;
  day: number;
  weekDay: number;
};

const START_DATE = new Date(547, 0, 1);

function getDaysDiff(date: Date): number {
  return Math.floor((date.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
}

function convert(date: Date): CustomDate {
  const days = getDaysDiff(date);

  const year = Math.floor(days / 360) + 1;
  const dayOfYear = ((days % 360) + 360) % 360;

  const month = Math.floor(dayOfYear / 72) + 1;
  const day = (dayOfYear % 72) + 1;
  const weekDay = (dayOfYear % 8) + 1;

  return { year, month, day, weekDay };
}

function CalendarGrid({ currentDay }: { currentDay: number }) {
  return (
    <div className="grid grid-cols-8 gap-2">
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
  const [today, setToday] = useState<CustomDate>(convert(new Date()));
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<CustomDate | null>(null);

  useEffect(() => {
    const i = setInterval(() => {
      setToday(convert(new Date()));
    }, 60000);
    return () => clearInterval(i);
  }, []);

  const handleConvert = () => {
    if (!input) return;
    setResult(convert(new Date(input)));
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900 to-black" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,white,transparent)]" />
      </div>

      <div className="p-10 grid grid-cols-3 gap-10">
        <div className="col-span-2 space-y-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6">
            <h1 className="text-3xl font-bold mb-4">Custom Calendar</h1>
            <p className="opacity-80">
              Time is not a line. It is a cycle.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6">
            <h2 className="text-2xl mb-4">Convert date</h2>

            <input
              type="date"
              className="text-black p-2 rounded mr-2"
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={handleConvert}
              className="bg-indigo-500 px-4 py-2 rounded"
            >
              Convert
            </button>

            {result && (
              <div className="mt-4">
                <p>Year: {result.year}</p>
                <p>Month: {result.month}</p>
                <p>Day: {result.day}</p>
                <p>Weekday: {result.weekDay}</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="sticky top-10 backdrop-blur-xl bg-white/10 rounded-3xl p-6">
            <h2 className="text-xl mb-2">Today</h2>
            <p className="mb-4 opacity-70">
              Year {today.year} • Month {today.month}
            </p>

            <CalendarGrid currentDay={today.day} />
          </div>
        </div>
      </div>
    </div>
  );
}