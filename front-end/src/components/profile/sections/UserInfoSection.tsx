import { UpdateProfile } from '@/api/user/user.type';
import BasicInput from '@/components/app/inputs/BasicInput';
import dashStyles from '@/styles/dash.module.css';
import { UseMutateFunction } from '@tanstack/react-query';
import { ReactElement, useRef, useState } from 'react';

interface UserInfoSectionProps {
  firstName: string;
  lastName: string;
  username_: string;
  isEditing?: boolean;
  mutate: UseMutateFunction<unknown, unknown, UpdateProfile, unknown>;
}

function UserInfoSection({
  firstName,
  lastName,
  username_,
  isEditing = false,
  mutate,
}: UserInfoSectionProps): ReactElement {
  const [username, setUsername] = useState(username_);
  const wasEditing = useRef(isEditing);
  const updateUsername = (): void => {
    wasEditing.current = isEditing;
    if (username != username_) {
      mutate({ username: username }, { onError: () => setUsername(username_) });
    }
  };

  if (!isEditing && wasEditing.current && username != username_) {
    updateUsername();
  }
  return (
    <>
      <h2 className={dashStyles.dash__h2}>{firstName || 'First name'}</h2>
      <h3 className={dashStyles.dash__h3}>{lastName || 'Last name'}</h3>
      <p className={dashStyles.dash__p}>as</p>
      {isEditing ? (
        <form
          onSubmit={(e): void => {
            e.preventDefault();
            updateUsername();
          }}
        >
          <BasicInput
            className={`${dashStyles.dash__username} ${dashStyles.dash__text__input}`}
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              wasEditing.current = isEditing;
              setUsername(e.currentTarget.value);
            }}
          />
        </form>
      ) : (
        <h4 className={dashStyles.dash__username}>{username || 'Username'}</h4>
      )}
    </>
  );
}

export default UserInfoSection;
