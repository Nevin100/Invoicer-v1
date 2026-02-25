interface PropType {
  mainText: string;
  count: string;
}
const HeaderInfoCard = ({ mainText, count }: PropType) => {
  return (
    <div className="   flex flex-col justify-center ">
      <p className="text-gray-400">{mainText}</p>
      <p className="font-semibold text-[40px]">{count}</p>
    </div>
  );
};

export default HeaderInfoCard;
