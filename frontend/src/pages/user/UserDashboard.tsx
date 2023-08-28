// import { Button } from "@components/ui/button"
import { TopBar } from "@components/TopBar";
import { SideBar } from "@components/main/SideBar";
import useUser from "@hooks/user/useUser";

export default function UserDashboard() {
    const userQuery = useUser();

    return (
        <>
            <TopBar/>  
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <SideBar className="hidden lg:block" />
                            <div className="col-span-3 lg:col-span-4 lg:border-l">
                                <div className="h-full px-4 py-6 lg:px-8">
                                    <h1 className="text-3xl font-bold">Welcome!</h1>
                                    <p className="text-large">@{userQuery.data?.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}