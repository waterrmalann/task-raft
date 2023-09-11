import useDashboard from "@hooks/user/useDashboard";
import BoardCardComponent from "./BoardCardComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RxStar } from "react-icons/rx";
import { Link } from "react-router-dom";
import { slugify } from "@/lib/utils";

const HomeComponent = () => {
  const {data, isLoading} = useDashboard();

  return (
    <div>
      <Alert className="mt-5">
        <RxStar className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can now create boards and invite collaborators.
        </AlertDescription>
      </Alert>
      {isLoading && <p>Loading...</p>}
      <h1 className="text-xl font-bold my-5">Recent Boards</h1>
      {(data?.recentBoards.length || 0) > 0 ? (
        <div className="flex gap-3">
          {
            data?.recentBoards.map(board => (
              <Link key={board.boardId} to={`/dash/boards/${board.boardId}`}>
                <div className="rounded-md border px-4 py-3 font-mono text-sm bg-white hover:bg-muted hover:cursor-pointer">
                  @{board.createdBy}/{slugify(board.boardName)}
                </div>
              </Link>
            ))
          }
        </div>
      ) : (
        <div className="py-5 text-center">
            <p>Your recently opened boards will show up here.</p>
        </div>
      )}

      <h1 className="text-xl font-bold my-5">Your Workspaces</h1>
      {(data?.boards.length || 0) > 0 ? (
        <div className="grid grid-cols-3">
        {data?.boards.map(board => (
          <BoardCardComponent key={board._id}
            _id={board._id}
            title={board.title}
            description={board.description}
            updatedAt={board.updatedAt}
          />
        ))}
        </div>
      ) : (
        <div className="py-5 text-center">
            <p>Your boards will show up here. Create a new board to get started.</p>
        </div>
      )}
    </div>
  )
}

export default HomeComponent;
