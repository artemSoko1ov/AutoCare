import { createProfileCarsPageData } from "@/entities/profile/model";
import ProfileCars from "@/widgets/profile-cars";

const ProfileCarsPage = () => {
  const section = createProfileCarsPageData();

  return <ProfileCars section={section} />;
};

export default ProfileCarsPage;
