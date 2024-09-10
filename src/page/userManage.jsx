import NavBar from "../layout/navBar"
import {toast } from 'react-toastify';


const products = [
    {
      id: 1,
      name: 'Basic Tee',
      imageSrc: 'https://www.plastor.co.uk/images/detailed/27/Green_360_Litre_Wheelie_Bin.jpg',
      statusColor: "yellow",
      value: 50,
    },
    {
      id: 2,
      name: 'Basic Tee',
      imageSrc: 'https://www.plastor.co.uk/images/detailed/27/Green_360_Litre_Wheelie_Bin.jpg',
      statusColor: "red",
      value: 90,
    },
    {
      id: 3,
      name: 'Basic Tee',
      imageSrc: 'https://www.plastor.co.uk/images/detailed/27/Green_360_Litre_Wheelie_Bin.jpg',
      statusColor: "green",
      value: 30,
    },
    {
      id: 4,
      name: 'Basic Tee',
      imageSrc: 'https://www.plastor.co.uk/images/detailed/27/Green_360_Litre_Wheelie_Bin.jpg',
      statusColor: "green",
      value: 30,
    },
    // More products...
  ]
  
  export default function UserManage() {
    const hendleClick = () => {
        toast.success("Send to admin already!");
    }
    return (
      <div className="bg-gray-200">
        <NavBar />
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"> 
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative ">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none lg:h-80">
                  <img
                    src={product.imageSrc}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className={`mt-1 text-lg text-gray-900`}>{product.value}%</p>
                  </div>
                  <button className={`text-sm font-bold text-gray-900 text-md px-10 py-3 rounded-md bg-green-400 opacity-75`}
                  style={{backgroundColor: product.statusColor}}
                  onClick={hendleClick}
                  >Send</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  