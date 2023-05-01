import { withProtected } from '@/providers/auth/auth.routes';
import Layout from '../layouts/Layout';
import ProfileCard from './ProfileCard';

interface IUserData {
  username: string;
  has2FA: boolean;
  profilePicture: string;
  createdAt: string;
  fortytwoId: number;
}

interface ProfileProps {
  canEdit: boolean;
  userData: IUserData;
}

function Profile({ canEdit, userData }: ProfileProps) {
  return (
    <Layout
      className="flex items-center justify-center h-screen bg-purple"
      title="Home"
    >
      <ProfileCard canEdit={canEdit} data={userData} />
      {/* <Achievements /> */}
      {/* <MatchHistory /> */}
      {/* <Stats /> */}
    </Layout>
  );
}

export default withProtected(Profile);
