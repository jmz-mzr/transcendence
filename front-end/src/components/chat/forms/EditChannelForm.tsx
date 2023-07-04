import BasicInput from '@/components/app/inputs/BasicInput';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import friendsStyles from '@/styles/friends.module.css';
import { IChannelUser } from '@/api/channel/channel.types';
import Line from '@/components/chat/line/Line';

const schema = Yup.object().shape({
  password: Yup.string(),
  withPassword: Yup.boolean().required(),
});

export type EditChannelFormValues = {
  withPassword: boolean;
  password: string;
  users: IChannelUser[];
};

interface EditChannelFormProps {
  initialValues: EditChannelFormValues;
  onSubmit: (values: EditChannelFormValues) => void;
  onLeave: () => void;
}

function EditChannelForm({
  initialValues,
  onSubmit,
  onLeave,
}: EditChannelFormProps): React.ReactElement {
  const { handleSubmit, values, handleChange, isValid, setFieldValue } =
    useFormik({
      initialValues,
      onSubmit,
      validationSchema: schema,
    });

  const onClick = (): void => {
    if (isValid) {
      handleSubmit();
    } else {
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
    }
  };
  console.log(values);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full px-4 py-8 overflow-y-auto hide-scrollbar">
      <div className="flex flex-col items-center space-y-8 w-full">
        <div className="flex flex-row space-x-4 items-center">
          <input
            type="checkbox"
            name="toggle password input"
            checked={values.withPassword}
            onChange={(event): void =>
              void setFieldValue('withPassword', event.target.checked)
            }
          />
          <p>Protéger le salon par un mot de passe</p>
        </div>
        {values.withPassword && (
          <BasicInput
            type="input"
            name="new channel password"
            className="text-black rounded-full w-1/2 py-2 px-4 outline-0 placeholder:text-center placeholder:antialiased antialiased"
            placeholder={
              !initialValues.withPassword
                ? 'Veuillez entrer un mot de passe'
                : 'Le nouveau mot de passe du salon'
            }
            value={values.password}
            onChange={handleChange('password')}
          />
        )}
      </div>

      <div className="flex flex-col items-center space-y-8 w-full">
        {/* <div className={friendsStyles.ctn__pre__friends__canvas}> */}
        <div className="space-x-4 items-center">
          <h2>Users</h2>
          {initialValues.users?.map((user) => (
            <Line key={user.userId} user={user.user} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-8 w-full">
        {/* <div className={friendsStyles.ctn__pre__friends__canvas}> */}
        <div className="space-x-4 items-center">
          <h2>Ban Users</h2>
          {initialValues.users?.map((user) => (
            <Line key={user.userId} user={user.user} />
          ))}
        </div>
      </div>

      <div className="flex flex-row space-x-4 items-center">
        <button
          onClick={onLeave}
          className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
        >
          Quitter le salon
        </button>
        <button
          type="submit"
          onClick={onClick}
          className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
        >
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
}

export default EditChannelForm;
