import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from '../page/login'
import UserManage from '../page/userManage'
import AdminManage from '../page/adminManage'

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/userManage",
        element: <UserManage />
    },
    {
        path: "/",
        element: <AdminManage />
    },
])
export default function MainRoute() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

