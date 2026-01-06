import { IoIosArrowRoundUp } from "react-icons/io";

type Proptype = {
    title: string;
    amount: number;
    incDecPercentage: number;
    isIncreased: boolean;
    text: string;
};

const FinMetricCard = ({ title, amount, incDecPercentage, isIncreased, text }: Proptype) => {
    return (
        <div
            className={`h-[107px] flex justify-between  rounded-lg`}
        >
            {/* Left Section - Title and Amount */}
            <div className="flex flex-col justify-between items-start">
                {/* Title */}
                <p className="text-[17px] opacity-60 font-[400]">{title}</p>

                {/* Amount */}
                <p className="text-[40px] font-[700]">${amount}</p>
            </div>

            {/* Right Section - Percentage Change and Additional Text */}
            <div className="flex flex-col justify-center items-end">
                {/* Percentage Change Box */}
                <div
                    className={`w-[71px] h-[30px] flex justify-center items-center gap-1 rounded-md px-2 
                        ${isIncreased ? "text-[#19C13A] bg-[#19C13A0D]" : "text-[#C11919] bg-[#C119190D]"}`}
                >
                    {/* Arrow Icon - Rotates downward if isIncreased is false */}
                    <IoIosArrowRoundUp size={24} className={isIncreased ? "" : "rotate-180"} />

                    {/* Percentage Value */}
                    <p className="text-[14px] font-[500]">{incDecPercentage}%</p>
                </div>

                {/* Additional Descriptive Text */}
                <p className="opacity-60 font-[400] text-right">{text}</p>
            </div>
        </div>
    );
};

export default FinMetricCard;
