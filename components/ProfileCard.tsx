// app/components/ProfileCard.tsx

import ProfileHoverCardDemo from "./profile/profile-hover-card";

interface ProfileCardProps {
  name: string;
  email: string;
  phone: string;
}

const ProfileCard = ({ name, email, phone }: ProfileCardProps) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 bg-transparent p-4 rounded-md w-fit border-0">
      {/* Profile Circle with Initials */}
      <div className="w-[80px] h-[80px] aspect-square rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold text-2xl">
        {initials}
      </div>




      <section className="text-[17px]">
        <h1 className="font-semibold text-[24px] text-gray-900">{name}</h1>
        <ProfileHoverCardDemo infoName="Email:" val={email} />
        <ProfileHoverCardDemo infoName="Phone:" val={phone} />
      </section>




    </div>
  );
};

export default ProfileCard;
