type FinMetricCardProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

const FinMetricCard = ({
  label,
  value,
  highlight = false,
}: FinMetricCardProps) => {
  return (
    <div
      className={`
        flex items-center justify-between
        px-4 sm:px-5 md:px-6
        h-auto md:h-[107px]
        rounded-xl border
        ${
          highlight
            ? "border-blue-600 bg-blue-50"
            : "border-slate-200 bg-slate-50"
        }
      `}
    >
      {/* Label */}
      <p className="text-sm sm:text-base font-medium text-slate-600">
        {label}
      </p>

      {/* Value */}
      <p className="text-lg sm:text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default FinMetricCard;
