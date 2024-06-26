import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import { postRequest } from '@/Functions/Requests';
import { useRouter } from 'next/router';
import { getToken } from '@/Functions/getToken';
import { Logout } from '@/Functions/Logout';
import CryptoJS from "crypto-js"
import moment from 'moment';
import ErrorComponent from '@/components/ErrorComponent'


export default function order() {
    const router = useRouter();
    const [data, setData] = useState({});
    const [getError, setGetError] = useState(false)

    const getOrder = async (id) => {
        try {
            const data = await postRequest('/api/orderDetail', { id: id })
            if (data.message && data.message === 'Unauthorized') {
                router.push(Logout())
            }
            else if (data.message && data.message.startsWith('Error')) {
                setGetError(true)
                setLoading(false)
                setTimeout(() => {
                    setGetError(false)
                }, 6000)
            } else {
                let bytesDelivery = CryptoJS.AES.decrypt(data.DeliveryAddress, process.env.JWT);
                let bytesEmail = CryptoJS.AES.decrypt(data.email, process.env.JWT);
                data.DeliveryAddress = bytesDelivery.toString(CryptoJS.enc.Utf8);
                data.email = bytesEmail.toString(CryptoJS.enc.Utf8);
                let bytesFullName = CryptoJS.AES.decrypt(data.fullName, process.env.JWT);
                data.fullName = bytesFullName.toString(CryptoJS.enc.Utf8);
                let bytesMobileNumber = CryptoJS.AES.decrypt(data.mobileNumber, process.env.JWT);
                data.mobileNumber = bytesMobileNumber.toString(CryptoJS.enc.Utf8);
                data.deliveryDate = data.deliveryDate ? moment(data.deliveryDate).local().format('dddd, MMM Do YY') : '';
                data.paymentDate = data.paymentDate ? moment(data.paymentDate).local().format('dddd, MMM Do, h:mm a') : '';
                data.packedOn = data.packedOn ? moment(data.packedOn).local().format('dddd, MMM Do, h:mm a') : '';
                data.acceptOn = data.acceptOn ? moment(data.acceptOn).local().format('dddd, MMM Do, h:mm a') : '';
                data.deliveredDate = data.deliveredDate ? moment(data.deliveredDate).local().format('dddd, MMM Do, h:mm a') : ''
                setData(data)
            }
        } catch (error) {
            setGetError(true)
            setTimeout(() => {
                setGetError(false)
            }, 6000)
        }
    }

    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query;
            getOrder(id)
        }
    }, [router.isReady])

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

            <main className='w-full flex flex-col'>
                <Navbar />
                {getError && <ErrorComponent />}
                {data && data.id ?
                    <div className='w-full flex flex-col gap-2 px-2 md:px-4 mt-20 pb-20'>
                        <div className='w-full md:w-11/12 mx-auto grid gap-6 grid-cols-1 md:grid-cols-3'>
                            <div className='flex flex-col order-3 md:order-1 gap-4 md:overflow-hidden p-2 w-full'>
                                <span className='font-medium underline uppercase'>Products</span>
                                {data.products.map((e, i) => {
                                    return (
                                        <Link href={`/product/${e.product._id}`} key={`thumbnail-${i}`} className='w-full relative flex-col hover:shadow-lg hover:rounded-b-lg cursor-pointer flex'>
                                            <img className='w-full rounded-lg' src={e.product.thumbnail} alt='' />
                                            <span className='pt-2 px-2 text-red-500 text-sm font-medium'>{e.product.title}</span>
                                            <div className='font-medium flex mt-2 justify-between px-2 text-xs'>
                                                <span>Product Price :</span>
                                                <span>&#x20b9; {e.product.price}</span>
                                            </div>
                                            <div className='font-medium flex justify-between px-2 text-xs'>
                                                <span>Quantity :</span>
                                                <span>{e.product.quantity}</span>
                                            </div>
                                            <div className='font-medium flex justify-between px-2 pb-2 text-xs'>
                                                <span>Total Price:</span>
                                                <span>&#x20b9; {e.product.price * e.product.quantity}</span>
                                            </div>
                                        </Link>
                                    )
                                })}

                            </div>
                            <div className='flex flex-col order-2 md:order-2 md:overflow-hidden p-2 w-full'>
                                <span className='mb-2 font-medium uppercase underline'>Track Order</span>
                                {data.paymentDate && <div className='w-full text-xs mt-4 flex flex-row font-medium gap-3 items-center'>
                                    <span className='w-3 h-3 rounded-full bg-red-500'></span>
                                    <span className=''>Order - <span className='font-medium'>{data.paymentDate}</span></span>
                                </div>}
                                {data.packedStatus && <div className='w-full flex text-xs mt-3 flex-row font-medium gap-3 items-center'>
                                    <span className='w-3 h-3 rounded-full bg-red-500'></span>
                                    <span className=''>Packed - <span className='font-medium'>{data.packedOn}</span></span>
                                </div>}
                                {data.acceptStatus && <div className='w-full flex text-xs mt-3 flex-row font-medium gap-3 items-center'>
                                    <span className='w-3 h-3 rounded-full bg-red-500'></span>
                                    <span className=''>Out for Delivery - <span className='font-medium'>{data.acceptOn}</span></span>
                                </div>}
                                {data.deliveredDate && <div className='w-full text-xs flex mt-3 font-medium flex-row gap-3 items-center'>
                                    <span className='w-3 h-3 rounded-full bg-red-500'></span>
                                    <span className=''>Delivered - <span className='font-medium'>{data.deliveredDate}</span></span>
                                </div>}
                            </div>
                            <div className='flex flex-col order-1 md:order-3 md:overflow-hidden p-2 w-full '>
                                <span className='mb-2 font-medium uppercase underline'>Summary</span>
                                <div className='w-full font-medium flex text-xs flex-row justify-between items-center'>
                                    <span className='font-medium'>Product Price</span>
                                    <span className='font-medium'>&#x20b9; {data.subTotal}</span>
                                </div>
                                <div className='w-full font-medium text-xs flex flex-row justify-between items-center'>
                                    <span className='font-medium'>Shipping Charges</span>
                                    <span className='font-medium'>&#x20b9; {data.shippingCharges}</span>
                                </div>
                                <div className='w-full font-medium text-xs flex flex-row justify-between items-center'>
                                    <span className='font-medium'>Tax</span>
                                    <span className='font-medium'>&#x20b9; {data.tax}</span>
                                </div>
                                <div className='w-full font-medium text-xs flex flex-row justify-between items-center'>
                                    <span className='font-medium'>Final Price</span>
                                    <span className='font-medium'>&#x20b9; {data.grandTotal}</span>
                                </div>
                                <span className='w-full my-4 bg-red-500 text-sm text-white font-medium p-2 rounded text-center'>{data.deliveryStatus ? `Delivered on ${data.deliveredDate}` : `Arriving on ${data.deliveryDate}`}</span>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='w-full flex flex-col gap-2 px-2 md:px-4 pb-10 mt-20 md:mt-20'>
                        <div className='w-full animate-pulse md:w-11/12 mx-auto grid gap-6 grid-cols-1 md:grid-cols-3'>
                            <div className='flex flex-row md:flex-col gap-4 w-full'>
                                <div className='w-full h-40 md:h-72 bg-slate-200' ></div>
                            </div>
                            <div className='bg-slate-200 h-40 w-full md:h-72'>
                            </div>
                            <div className='bg-slate-200 h-40 w-full md:h-72'>
                            </div>
                        </div>
                    </div>
                }
            </main>
        </>
    )
}
