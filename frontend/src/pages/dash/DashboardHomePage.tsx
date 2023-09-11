import {Button} from '@components/ui/button';
import {RxPlus} from 'react-icons/rx';
import HomeComponent from '@components/main/HomeComponent';
import useUser from '@hooks/user/useUser'
import CreateBoardModal from '@components/modals/CreateBoardModal';

const DashboardHomePage = () => {
    const userQuery = useUser();
    return (
        <>
            <div className="overflow-y-hidden">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome!</h1>
                        <p className="text-large">@{userQuery.data?.username}</p>
                    </div>
                    <CreateBoardModal>
                        <Button className="mr-2" variant="outline"><RxPlus className="mr-2 h-4 w-4" /> Create Board</Button>
                    </CreateBoardModal>
                </div>
                <HomeComponent />
            </div>
        </>
    )
}

export default DashboardHomePage