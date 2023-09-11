import useInviteAccept from '@hooks/user/useInviteAccept';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

// interface QueryParams {
//     uid: string;
// }

export const InviteAccept = () => {
    const { boardId } = useParams();

    const { data, isLoading, isError } = useInviteAccept(boardId || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500 border-opacity-50">
                </div>
            </div>
        )
    }

    if (isError) {
        return <p className="px-8 text-center text-sm text-red-500">Error accepting invite.</p>;
    }

    if (!data.success) {
        return <p className="px-8 text-center text-sm text-red-500">{data.message}</p>
    }

    return (
        <div>
            <h2 className="px-8 py-2 text-xl text-center">You have been accepted as a collaborator!</h2>
            <p className="px-8 text-center text-sm text-muted-foreground">Goto {" "}
                <Link
                    to={`/dash/boards/${boardId}`}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    the board.
                </Link>
                .
            </p>
        </div>
    );
}
