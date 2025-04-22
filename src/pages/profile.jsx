import { Informations } from "./profile/CardInformations";
import { Update } from "./profile/CardPassword";

const Profile = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Profile</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Informations />
        <Update />
      </div>
    </div>
  );
};

export default Profile;
