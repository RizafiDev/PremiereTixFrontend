import Logo from '../../public/Premiere.svg';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
function Navbar(){
return(
    <nav className='container z-50 backdrop-blur-xl  shadow-sm bg-cusprimary flex items-center w-full mx-auto my-auto justify-between pl-5 pr-7'>
        <div className="brand">
            <img src={Logo} alt="" className='w-36' />
        </div>
        <div className="profile flex items-center space-x-5">
        <div className="search relative flex items-center">
        <MagnifyingGlassIcon className='h-4 w-4 absolute left-3 text-cuswhite'/>
            <input type="text" placeholder='Cari Film' className='outline-2 focus:outline-cuswhite w-[300px] transition-all text-cuswhite outline-cuswhite placeholder:text-cuswhite rounded-sm pt-2 pb-2 px-1.5 pl-9.5 truncate flex font-semibold text-sm' />
        </div>
            <button className='text-cuswhite font-semibold border py-2 text-sm  transition-all rounded-lg border-cuswhite px-5 truncate'>Masuk</button>
            <button className='font-semibold py-2 text-sm rounded-lg text-cusprimary bg-cuswhite px-5 truncate transition-all'>Daftar</button>
        </div>
    </nav>
)
}
export default Navbar