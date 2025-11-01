// app/components/ProfileCard.tsx

// import EmailHoverCardDemo from "./Profile/profile-hover-card";

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
      <div className="w-30 h-30 aspect-square rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold text-2xl">
        {initials}
      </div>

      {/* Text Content */}
      <div className="text-lg">
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-gray-600">
          Email -{" "}
          <a
            href={`mailto:${email}`}
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {email}
          </a>
        </div>
        <div className="text-gray-600">
          Phone No -{" "}
          <a href={`tel:${phone}`} className="hover:underline">
            {phone}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
