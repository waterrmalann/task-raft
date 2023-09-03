import useUser from '@hooks/user/useUser'

const DashboardHomePage = () => {
    const userQuery = useUser();
    return (
        <>
            <h1 className="text-3xl font-bold">Welcome!</h1>
            <p className="text-large">@{userQuery.data?.username}</p>
        </>
    )
}

export default DashboardHomePage