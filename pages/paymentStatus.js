import { getRequest, postRequest } from '@/Functions/Requests';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ErrorComponent from '@/components/ErrorComponent'


function paymentStatus() {
    const router = useRouter()
    const [data, setData] = useState({})
    const [cartData, setCartData] = useState([])
    const [getError, setGetError] = useState(false)

    const getPaymentData = async () => {
        const { payment_id, payment_request_id } = router.query;
        if (payment_id && payment_request_id) {
            let time = moment().add(5, 'days').format('llll');
            const response = await postRequest('/api/paymentStatus', {
                id: payment_id,
                request: payment_request_id,
                time: time
            });

            if (response.message && response.message.startsWith('Error')) {
                setGetError(true)
                setTimeout(() => {
                    setGetError(false)
                }, 6000)
            }

            if (response.status === 'Paid') {
                getCart()
                let stillUtc = moment.utc(response.payment).toDate();
                let responseTime = moment(stillUtc).local().format('llll')
                response.payment = responseTime;
            }
            setData(response)
        }
    }

    const getCart = async () => {
        const response = await getRequest('/api/findAllCart')
        if (response.message && response.message.startsWith('Error')) {
            setGetError(true)
            setTimeout(() => {
                setGetError(false)
            }, 6000)
        }else{
            setCartData(response)
        }
      }

    useEffect(() => {
        if (router.isReady) {
            getPaymentData();
        }
    }, [router.isReady])

    return (
        <>
            <Head>
                <title>Cart</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-full'>
                <Navbar cartData={cartData} />
                {getError && <ErrorComponent />}
                <main className='w-full flex flex-col md:flex-row box-border'>
                    <div className='mt-20 md:mt-16 px-2 md:px-16 pb-4 md:pb-10 w-full justify-center items-center flex flex-col'>

                        {data && data.message || data.status ?
                            <div className='w-full flex flex-col md:mt-6 relative md:w-1/2'>
                                <div className='w-full flex flex-col md:w-10/12'>
                                    <span className='font-medium text-lg text-red-500'>{data.status === 'Paid' && 'Order Confirmed !!'}</span>
                                    <span className='text-sm font-medium'>{data.status === 'Paid' && `Paid on ${data.payment}`}</span>
                                    <span className='text-sm font-medium'>{data.status === 'Paid' && 'Thank you for your order.'}</span>
                                    <span className='text-sm font-medium text-red-500'>{data.status === 'failed' && data.failedMessage && data.failedMessage.reason && `Message: ${data.failedMessage.reason}`}</span>
                                    <span className='text-sm font-medium'>{data.status === 'failed' && data.failedMessage && data.failedMessage.message && `Reason: ${data.failedMessage.message}`}</span>
                                    <span className='text-sm font-medium'>{data.status === 'failed' && 'Payment Failed, please try again after some time.'}</span>
                                    {data.status === 'Not Found' && <span className='text-sm font-medium'>Invalid Payment Request. If amount is deducted from your account, please <span className='text-red-500'>contact us</span>.</span>}
                                </div>
                                <div className='absolute p-16 md:p-10 border-2 border-red-500 rounded-full right-1/2 top-1/2 md:top-0 translate-y-1/2 md:translate-y-0 translate-x-1/2 md:translate-x-0 md:right-0 uppercase'>
                                    <span className='absolute font-bold text-center w-full text-xl md:text-sm text-red-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                                        {data.status}
                                    </span>
                                </div>
                            </div>
                            :
                            <div className='absolute left-1/2 flex flex-col top-20 -translate-x-1/2'>
                                <Loading />
                                <span className='font-medium text-sm mt-32'>Verifying your payment</span>
                            </div>
                        }
                    </div>
                </main>
            </main>
        </>
    )
}

export default paymentStatus