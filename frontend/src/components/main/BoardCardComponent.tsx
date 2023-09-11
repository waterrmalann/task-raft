import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card"
import { Button } from "@components/ui/button"
import { formatDistanceToNow } from 'date-fns';
import { RxDoubleArrowRight, RxCircle } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { Board } from "@hooks/user/useDashboard";

const BoardCardComponent = ({ _id, title, description, updatedAt }: Board) => {
    return (
        <Card className="m-2 max-w-[450px]">
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </div>
                <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                    <Link to={`/dash/boards/${_id}`}><Button variant="secondary" className="px-3 shadow-none">
                        <RxDoubleArrowRight className="mr-2 h-4 w-4" />
                        Open
                    </Button></Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <RxCircle className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                        Board
                    </div>
                    <div>• Updated {formatDistanceToNow(new Date(updatedAt))} ago</div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BoardCardComponent