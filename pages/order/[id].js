import Line from '@/components/Line';
import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import moment from 'moment/moment';
import { BiCart } from 'react-icons/bi';
import ProductLoading from '@/components/ProductLoading';
import { postRequest } from '@/Functions/Requests';
import { useRouter } from 'next/router';
import { getToken } from '@/Functions/getToken';
import { Logout } from '@/Functions/Logout';

export default function order() {
    const router = useRouter();
    const [data, setData] = useState({});
    const [cart, setCart] = useState([]);

    const getOrder = async (id) => {
        try {
            const data = await postRequest('/api/orderDetail', id)
            setData(data)
            console.log(data)
        } catch (error) {
            console.log('err')
        }
    }

    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query;
            getOrder(id)
            
        }
    }, [router.isReady])

    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(localCart)
    }, [])

    useEffect(() => {
        if (!getToken()) {
            router.push(Logout());
        }
    }, [])


    return (
        <>
            <Head>
                <title>{data.title}</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            {/* <main className='w-100 flex flex-col'>
                <Navbar cart={cart} />
                    <div className='w-full flex flex-col gap-2 px-2 md:px-4 pb-10 mt-20 md:mt-20'>
                        <div className='w-full grid gap-6 grid-cols-1 md:grid-cols-12'>
                            <div className='flex flex-row md:flex-col gap-4 order-2 md:order-1 overflow-scroll md:overflow-hidden w-full md:col-span-1'>
                                {data.images.map((e, i) => {
                                    return (
                                        <img key={`thumbnail-${i}`} onClick={() => setImage(e)} className='md:w-full w-20 cursor-pointer' src={e} alt={data.title} />
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
                                    <div className='w-full flex gap-1'>
                                        <span className=''>&#x20b9;</span>
                                        <span className='text-4xl'>{data.price}</span>
                                    </div>
                                    <div className=''>
                                        Inclusive of all taxes
                                    </div>
                                </div>
                                <Line />
                                <div className='w-full flex flex-col'>
                                    <span className='font-medium'>About this item</span>
                                    <span className='text-justify'>Essential Oil, Makeup Primer, Foundation, Loose Powder, Blender, 2 Lipsticks, Eyelashes, Makeup Fixer, Compact Face powder, Concealer
                                        Waterproof foundation,face primer,makeup fixer
                                        After testing, we found there are still around 3-5% of powder-based cosmetic such as eye shadow will be damaged during the long way of international shipment, no matter how carefully we packed them. Except contact us for help or claim your damage, here is a handy tip for reforming the damaged powder-based make-up into new one.
                                        The trendy and stylish, makeup set for traveling or everyday use for all makeup enthusiasts.
                                        A creamy semi-matte lipstick, Leaves lips with a luminous shine and rich full coverage,This formula moisturizes and comforts lips.</span>
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
                                <button onClick={() => handleAddToCart(data)} className='p-2 w-full mt-6 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-red-500 bg-red-500  hover:text-red-500 text-white uppercase font-semibold hover:bg-white'>
                                    <BiCart className="text-xl " />
                                    <span className="text-base">Add to Cart</span>
                                </button>
                            </div>
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <span className='font-semibold mb-4 text-2xl'>Product Description</span>
                            <div className='flex flex-col gap-12 w-full justify-center md:px-28'>
                                {data.images.map((e, i) => {
                                    return (
                                        <div key={`imagedesc-${i}`} className='w-full gap-4 grid grid-cols-1 md:grid-cols-6'>
                                            <img className={`bg-cover md:col-span-2 w-fit order-1 ${i % 2 === 0 ? '' : 'md:order-2'}`} src={e} alt={data.title} />
                                            <span className={`order-2 md:col-span-4 ${i % 2 === 0 ? '' : 'md:order-1'}`}>Essential Oil, Makeup Primer, Foundation, Loose Powder, Blender, 2 Lipsticks, Eyelashes, Makeup Fixer, Compact Face powder, Concealer Waterproof foundation,face primer,makeup fixer After testing, we found there are still around 3-5% of powder-based cosmetic such as eye shadow will be damaged during the long way of international shipment, no matter how carefully we packed them.</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                    <div className='w-full flex flex-col gap-2 px-2 md:px-4 pb-10 mt-20 md:mt-20'>
                        <ProductLoading />
                    </div>
            </main> */}
        </>
    )
}