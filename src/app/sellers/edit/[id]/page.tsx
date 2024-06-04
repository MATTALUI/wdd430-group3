import React from 'react';
import { getUser } from '@/lib/data';
import UserProfileClient from '@/components/UserProfileClient';

interface Props {
    params: {
        id: string;
    };
}

const UserProfilePage = async ({ params }: Props) => {
    const { id } = params;
    const user = await getUser({ id });

    return <UserProfileClient user={user} />;
};

export default UserProfilePage;
