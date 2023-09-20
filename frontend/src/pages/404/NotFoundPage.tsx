import { Button } from "@components/ui/button"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="block text-2xl">404</h1>
      <h2 className="block text-xl font-bold">Page Not Found</h2>
      <Link to="/dash"><Button className="my-3">Go Back</Button></Link>
    </div>
  )
}

export default NotFoundPage