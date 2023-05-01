import Line from '@/components/Line';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import moment from 'moment/moment';
import { BiCart } from 'react-icons/bi';
import ProductLoading from '@/components/ProductLoading';
import { addToCart } from '@/Functions/addToCart';
import { getRequest } from '@/Functions/Requests';
import ErrorComponent from '@/components/ErrorComponent'
import CryptoJS from 'crypto-js'
import { Logout } from '@/Functions/Logout';


export default function product() {
    const router = useRouter();
    const [data, setData] = useState({});
    const [image, setImage] = useState('');
    const [cartData, setCartData] = useState([])
    const [getError, setGetError] = useState(false)
    const [status, setStatus] = useState('')

    const getCart = async () => {
        const response = await getRequest('/api/findAllCart')
        setCartData(response)
    }

    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query
            fetch(`/api/getOneProduct/${id}`)
                .then(res => res.json())
                .then((res) => {
                    if (res.message === 'Success' && res.value) {
                        let bytes = CryptoJS.AES.decrypt(res.value, process.env.JWT);
                        const response = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                        setData(response)
                        setImage(response.thumbnail)
                    }
                    else {
                        setError(true)
                        setTimeout(() => {
                            setError(false)
                        }, 5000)
                    }
                })
                .catch((err) => {
                    setGetError(true)
                    setTimeout(() => {
                        setGetError(false)
                    }, 6000)
                })
        }
    }, [router.isReady])

    const handleAddToCart = async (item) => {
        try {
            setStatus('Adding...')
            setTimeout(() => {
                setStatus('')
            }, 5000)
            const response = await addToCart(item);
            if (response.message && response.message === 'Unauthorized') {
                setStatus("Please Login.")
                router.push(Logout())
                setTimeout(() => {
                    setStatus('')
                }, 5000)
            }
            else if (response.message && response.message.includes('Error')) {
                setGetError(true)
                setTimeout(() => {
                    setGetError(false)
                }, 3000)
            }
            else {
                setStatus(response.message)
                setTimeout(() => {
                    setStatus('')
                }, 5000)
                getCart();
            }
        } catch (error) {
            setGetError(true)
            setTimeout(() => {
                setGetError(false)
            }, 3000)
        }
        return;
    }


    return (
        <>
            <Head>
                <title>{data.title}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-100 flex flex-col'>
                <Navbar cartData={cartData} />
                {status && <div className="p-4 fixed font-medium right-1 top-1 z-50 w-10/12 md:w-3/12 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    {status}
                </div>}
                {getError && <ErrorComponent />}
                {'images' in data ?
                    <div className='w-full flex flex-col gap-2 px-2 md:px-4 pb-10 mt-20 md:mt-20'>
                        <div className='w-full grid gap-6 grid-cols-1 md:grid-cols-12'>
                            <div className='flex flex-row md:flex-col gap-4 order-2 md:order-1 overflow-scroll md:overflow-hidden w-full md:col-span-1'>
                                {data.images.map((e, i) => {
                                    return (
                                        e.image && <img key={`thumbnail-${i}`} onClick={() => setImage(e.image)} className='md:w-full w-20 cursor-pointer' src={e.image} alt={data.title} />
                                    )
                                })}
                            </div>
                            <div className='md:col-span-4 order-1 md:order-2'>
                                <img className='w-full bg-cover' src={image} alt={data.title} />
                            </div>
                            <div className='md:col-span-4 order-4 md:order-3 w-full flex flex-col'>
                                <span className='font-medium text-2xl'>{data.title}</span>
                                <Link className='text-sm font-medium text-red-500' href={'/seller/exrcvbh'}>Rahul Rajput</Link>
                                <Line />
                                <div className='w-full flex flex-col gap-1 font-medium'>
                                    <div className='w-full font-medium flex gap-1'>
                                        <span className=''>&#x20b9;</span>
                                        <span className='text-4xl'>{data.price}</span>
                                    </div>
                                    <div className='font-medium'>
                                        Inclusive of all taxes
                                    </div>
                                </div>
                                <Line />
                                <div className='w-full flex font-medium flex-col'>
                                    <span className='font-medium'>About this item</span>
                                    <span className='text-justify'>{data.description}</span>
                                </div>
                            </div>
                            <div className='md:col-span-3 gap-1 p-2 md:p-4 order-3 md:order-4 rounded shadow-lg w-full flex flex-col h-fit justify-start items-start'>
                                <div className='w-full flex gap-1 font-medium'>
                                    <span className=''>MRP : &#x20b9;</span>
                                    <span className='text-4xl'>{data.price}</span>
                                </div>
                                <span>Delivery on <span className='font-medium'>{moment().add(5, 'days').format('dddd, Do MMMM.')}</span></span>
                                <span className='font-medium text-sm text-red-500'>In stock</span>
                                <span className='font-medium text-sm inline-block'>Sold by <Link className='text-red-500' href={'/seller/exrcvbh'}>Rahul Rajput</Link> and Delivered by Easyorder.</span>
                                <button onClick={() => handleAddToCart(data)} className='p-2 w-full mt-6 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-red-500 bg-red-500  hover:text-red-500 text-white uppercase font-medium hover:bg-white'>
                                    <BiCart className="text-xl " />
                                    <span className="text-base">Add to Cart</span>
                                </button>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <span className='font-medium mb-4 text-2xl'>Product Description</span>
                            <div className='flex flex-col gap-12 w-full justify-center md:px-28'>
                                {data.images.map((e, i) => {
                                    return (
                                        e.image && <div key={`imagedesc-${i}`} className='w-full gap-4 grid grid-cols-1 md:grid-cols-6'>
                                            <img className={`bg-cover md:col-span-2 w-fit order-1 ${i % 2 === 0 ? '' : 'md:order-2'}`} src={e.image} alt={data.title} />
                                            <span className={`order-2 font-medium md:col-span-4 ${i % 2 === 0 ? '' : 'md:order-1'}`}>{e.desc}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div> :
                    <div className='w-full flex flex-col gap-2 px-2 md:px-4 pb-10 mt-20 md:mt-20'>
                        <ProductLoading />
                    </div>
                }
            </main>
        </>
    )
}
