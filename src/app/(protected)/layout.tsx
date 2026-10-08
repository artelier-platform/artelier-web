import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function ProtectedLayout({children}: { children: ReactNode })
{
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        redirect('/login');
    }

    return <>{children}</>;
}