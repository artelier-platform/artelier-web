import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    const userRole = cookieStore.get('user_role')?.value;

    if (userRole !== 'ADMIN') {
        const dest = refreshToken ? '/' : '/login';
        redirect(dest);
    }

    return <AdminShell>{children}</AdminShell>;
}
