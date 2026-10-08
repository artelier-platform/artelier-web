import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import AuthPageShell from '@/components/auth/AuthPageShell';

export default async function AuthLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
        redirect('/');
    }

    // Las páginas /login y /register no pintan nada: el formulario vive en AuthPageShell
    // para que no se reinicie al cambiar de una a otra (así se conserva la animación).
    return (
        <>
            {children}
            <Suspense>
                <AuthPageShell />
            </Suspense>
        </>
    );
}
