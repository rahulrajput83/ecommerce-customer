import Link from "next/link";
import { useRouter } from "next/router"
import { BiCart, BiHomeAlt2, BiLogIn, BiSearch, BiUser } from 'react-icons/bi'

export default function Navbar() {
    const router = useRouter();

    const handlebtn = () => {
        if (router.pathname.includes('login')) {
            router.push('/')
            return;
        }
        router.push('/login')
    }
    return (
        <div className="flex flex-row fixed z-10 gap-2 sm:gap-5 w-full justify-center items-center bg-red-500 p-3 box-border">
            <Link href='/' className="text-white hidden sm:block font-semibold mr-auto text-base"><span className="font-bold text-lg">EASY</span> ORDER</Link>
            <form className="flex flex-row relative w-full sm:w-2/3 md:w-1/3 justify-center items-center">
                <input className="w-full py-2 rounded-full bg-white outline-none text-sm px-3" type='text' placeholder="Search" />
                <button type="submit" className="bg-red-200 rounded-full hover:bg-red-100 cursor-pointer absolute flex w-10 justify-center items-center right-0 h-full">
                    <BiSearch className="" />
                </button>
            </form>

            <Link href='/cart' className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-2 border-white hover:bg-red-500  hover:text-white uppercase font-semibold bg-white'>
                <BiCart className="text-xl " />
                <span className="text-sm hidden sm:block">Cart</span>
            </Link>

            <button onClick={handlebtn} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-2 border-white hover:bg-red-500  hover:text-white uppercase font-semibold bg-white'>
                {router.pathname.includes('login') ?
                    <>
                        <BiHomeAlt2 className="text-xl" />
                        <span className="text-sm">Home</span>
                    </>
                    :
                    <>
                        <BiUser className="block text-xl sm:hidden" />
                        <BiLogIn className="text-xl hidden sm:block" />
                        <span className="text-sm hidden sm:block">Login</span>
                    </>}
            </button>
        </div>
    )
}
