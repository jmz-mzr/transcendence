import BasicInput from '@/components/app/inputs/BasicInput';
import dashStyles from '@/styles/dash.module.css';
import { ChangeEvent, FormEvent, ReactElement, useState } from 'react';

interface UserInfoSectionProps {
  firstName: string;
  lastName: string;
  username: string;
  isEditing?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

function UserInfoSection({
  firstName,
  lastName,
  username,
  isEditing = false,
  onChange,
  onSubmit,
}: UserInfoSectionProps): ReactElement {
  // const [username, setUsername] = useState(username);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   fetch(`${BACKEND_URL}/profile`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: {
  //       Authorization: `Bearer ${getCookie('jwt')}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     // setUsername to value if username already used
  //     .catch((err) => console.error(err));
  // };

  return (
    <>
      <h2 className={dashStyles.dash__h2}>{firstName || 'First name'}</h2>
      <h3 className={dashStyles.dash__h3}>{lastName || 'Last name'}</h3>
      <p className={dashStyles.dash__p}>as</p>
      {!!isEditing && !!onChange && !!onSubmit ? (
        <form onSubmit={onSubmit}>
          <BasicInput
            className={`${dashStyles.dash__username} ${dashStyles.dash__text__input}`}
            type="text"
            name="username"
            value={username}
            onChange={onChange}
          />
        </form>
      ) : (
        <h4 className={dashStyles.dash__username}>{username || 'Username'}</h4>
      )}
    </>
    // <div className="relative m-3" data-te-input-wrapper-init>
    //   {canEdit ? (
    //     <form onSubmit={handleSubmit}>
    //       <BasicInput
    //         className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-100 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
    //         type="text"
    //         name="username"
    //         value={username}
    //         onChange={(e) => setUsername(e.currentTarget.value)}
    //       />
    //     </form>
    //   ) : (
    //     <h1>{value}</h1>
    //   )}
    // </div>
  );
}

export default UserInfoSection;
