type TravelPackage = {
  id: number;
  title: string;
  location: string;
  price: number;
  tags: string[];
};

export type ScoutResult = {
  item: TravelPackage;
  reason: string;
};

type Props = {
  results: ScoutResult[];
};

export default function ResultsList({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <section className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Top Matches</h2>

      {results.map((r) => (
        <div
          key={r.item.id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {r.item.title}
              </h3>
              <p className="text-sm text-gray-600">
                {r.item.location} • ${r.item.price}
              </p>
            </div>

            <span className="text-xs rounded-full bg-gray-100 text-gray-800 px-3 py-1">
              ID {r.item.id}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {r.item.tags.map((t) => (
              <span
                key={t}
                className="text-xs rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="mt-3 text-sm text-gray-800">
            <span className="font-medium">Why this matches:</span> {r.reason}
          </p>
        </div>
      ))}
    </section>
  );
}