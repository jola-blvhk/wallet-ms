export default function BalanceCard({
  label,
  balance,
}: {
  label: string;
  balance: number;
}) {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl dark:bg-gray-800 dark:text-white">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
        {balance?.toFixed(2) || 0}
      </p>
    </div>
  );
}
