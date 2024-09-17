import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Location from '../page/location'
import FileUpload from '../page/FileUpload'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Location />
    },
    {
        path: "/file",
        element: <FileUpload />
    },
])
export default function MainRoute() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

