type Proptype = {
  title: string;
  amount: number;
};

const FinMetricCard = ({ title, amount }: Proptype) => {
  return (
    <div className="h-[107px] flex items-center justify-around rounded-lg px-3 rounded-md border-2 border-blue-600 bg-blue-50/40">
      {/* Title */}
      <p className="text-2xl sm:text-base md:text-2xl text-blue-800 font-semibold">
        {title}:
      </p>

      {/* Amount */}
      <p className="text-xl sm:text-3xl font-bold text-blue-900 ">
        ₹{amount}
      </p>
    </div>
  );
};

export default FinMetricCard;
