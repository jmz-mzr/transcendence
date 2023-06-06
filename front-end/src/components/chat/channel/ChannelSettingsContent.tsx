/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import ChatLayout from '@/components/chat/layouts/ChatLayout';
import {
  useChannelGet,
  useChannelPut,
  useLeaveChannelDelete,
} from '@/api/channel/channel.api';
import { generateChannelTitles, isAdmin } from '@/utils/channel.util';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import EditChannelForm, {
  EditChannelFormValues,
} from '@/components/chat/forms/EditChannelForm';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from '@/providers/auth/auth.context';

interface ChannelSettingsContentProps {
  channelId: number;
}

function ChannelSettingsContent({
  channelId,
}: ChannelSettingsContentProps): React.ReactElement {
  const router = useRouter();

  const { user } = useAuth();

  const { data: channel, isLoading } = useChannelGet(channelId, {
    enabled: isNaN(channelId) === false && channelId !== null,
  });

  const { mutate: leaveChannel, isLoading: leaving } = useLeaveChannelDelete({
    onSuccess: () => {
      void router.push('/chat');
    },
  });

  const { mutate: updateChannel, isLoading: editing } = useChannelPut({
    onSuccess: () => {
      void router.push(`/chat/channel/${channelId}`, undefined, {
        shallow: true,
      });
    },
    onError: () => {
      toast.error('Une erreur est survenue lors de la mise à jour du salon.');
    },
  });

  const titles = React.useMemo(
    () =>
      channel
        ? generateChannelTitles(channel)
        : {
            title: '',
            acronym: '',
          },
    [channel]
  );

  const onSubmit = (values: EditChannelFormValues): void => {
    updateChannel({
      channelId,
      admins: values.admins,
      password: values.withPassword ? values.password : undefined,
      withPassword: values.withPassword,
    });
  };

  const onLeave = (): void => {
    leaveChannel(channelId);
  };

  if (isLoading || !channel) {
    return <ChatLayout title="Salon" screen="create" loading />;
  }

  if (!user || !isAdmin(user.id, channel)) {
    return (
      <ChatLayout
        title="Salon"
        screen="create"
        topLeft={{
          icon: <AiOutlineCloseCircle size={16} />,
          href: `/chat/channel/${channelId}`,
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-sm font-bold text-center">
            Vous n'avez pas les droits pour modifier ce salon.
          </h1>
        </div>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout
      loading={leaving || editing}
      title={titles.title}
      screen="create"
      topLeft={{
        icon: <AiOutlineCloseCircle size={16} />,
        href: `/chat/channel/${channelId}`,
      }}
    >
      <EditChannelForm
        users={channel.users}
        onLeave={onLeave}
        onSubmit={onSubmit}
        initialValues={{
          admins: channel.users
            .filter((item) => item.admin)
            .map((item) => item.user.id),
          password: '',
          withPassword:
            channel.password && channel.password.length > 0 ? true : false,
        }}
      />
    </ChatLayout>
  );
}

export default ChannelSettingsContent;
