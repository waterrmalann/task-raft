import useEmailVerification from '@hooks/user/useEmailVerification';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

// interface QueryParams {
//     uid: string;
// }

export const EmailVerifier = () => {
    const { code } = useParams();
    const [searchParams] = useSearchParams();
    const uid = searchParams.get('uid');

    const { data, isLoading, isError } = useEmailVerification(code || '', uid || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500 border-opacity-50">
                </div>
            </div>
        )
    }

    if (isError) {
        return <p className="px-8 text-center text-sm text-red-500">Error verifying email</p>;
    }

    if (!data.success) {
        return <p className="px-8 text-center text-sm text-red-500">{data.message}</p>
    }

    return (
        <div>
            <h2 className="px-8 py-2 text-xl text-center">Your account has been successfully verified!</h2>
            <p className="px-8 text-center text-sm text-muted-foreground">Login to your{" "}
                <Link
                    to="/login"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    account.
                </Link>
                .
            </p>
        </div>
    );
}
