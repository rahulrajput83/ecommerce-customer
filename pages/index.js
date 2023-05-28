import CardLoading from '@/components/CardLoading'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Category from '@/components/Category'
import ErrorComponent from '@/components/ErrorComponent'
import { useWindowSize } from '@/Functions/GetWidth'
import { addToCart } from '@/Functions/addToCart'
import { getRequest } from '@/Functions/Requests'
import CryptoJS from 'crypto-js'
import { useRouter } from 'next/router'
import { Logout } from '@/Functions/Logout'

const categories = ['Electronics', 'Footwear', 'Home, Kitchen, Pets', 'Beauty, Health, Grocery', 'Books', "Men's Fashion", "Women's Fashion", "Kid's Fashion"]
const price = ['Under ₹1,000', '₹1,000 - ₹5,000', '₹5,000 - ₹10,000', 'Over ₹10,000']
const productOrder = ['Low to High', 'High to Low']
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const image = ['https://images-eu.ssl-images-amazon.com/images/G/31/img22/wearables/boat/avail-Tall_Hero_3000X1200_boAt_1._CB587210748_.jpg', 'https://m.media-amazon.com/images/I/71q7LQvKl3L._SX3000_.jpg', 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Fashion/Event/Gateway/JuneWRS/Teaser/NonPrime-PC-3000._CB587224584_.jpg', 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungM/M14/GW_May/D77911710_IN_WLME_SamsungM_M145G_Launch_tallhero_3000x1200._CB587370854_.jpg', 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Fresh/MAY/GW/28/28th_Fresh_GW_Hero_PC2x_NC._CB587390594_.jpg', 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Beauty/GW/ATF/Smart-Shopping-Days--Skincare-PC-vdsc._CB589156091_.jpg']

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    title: '',
    Category: '',
    Price: '',
    productOrder: ''
  })
  const size = useWindowSize();
  const [showFilter, setShowFilter] = useState(false)
  const [cartData, setCartData] = useState([])
  const [error, setError] = useState(false)
  const [status, setStatus] = useState('')

  const getProducts = () => {
    setLoading(true)
    fetch('/api/getProduct', {
      method: 'POST',
      body: JSON.stringify(filter)
    })
      .then(res => res.json())
      .then((res) => {
        if (res.message === 'Success' && res.value) {
          setLoading(false)
          let bytes = CryptoJS.AES.decrypt(res.value, process.env.JWT);
          const productsItem = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          setProducts(productsItem)
        }
        else {
          setError(true)
          setTimeout(() => {
            setError(false)
          }, 5000)
        }

      })
      .catch((err) => {
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 5000)
      })
  }

  useEffect(() => {
    getProducts();
  }, [])

  useEffect(() => {
    setProducts([])
    getProducts();
  }, [filter])

  useEffect(() => {
    setFilter({ ...filter, title: searchQuery })
  }, [searchQuery])

  const getCart = async () => {
    const response = await getRequest('/api/findAllCart')
    setCartData(response || [])
  }

  const handleAddToCart = async (item) => {
    try {
      setStatus('Adding...')
      setTimeout(() => {
        setStatus('')
      }, 5000)
      const response = await addToCart(item);
      if (response.message && response.message.includes('Error')) {
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 3000)
      }
      else {
        if (response.message && response.message === 'Unauthorized') {
          setStatus("Please Login.")
          router.push(Logout())
          setTimeout(() => {
            setStatus('')
          }, 5000)
        }
        else {
          setStatus(response.message)
          setTimeout(() => {
            setStatus('')
          }, 5000)
          getCart();
        }

      }
    } catch (error) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    }
    return;
  }

  const resetFilter = () => {
    setFilter({
      title: searchQuery,
      Category: '',
      Price: '',
      productOrder: ''
    })
  }

  return (
    <>
      <Head>
        <title>Home - Customer</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className='w-100 flex flex-col box-border'>
        <Navbar cartData={cartData} setSearchQuery={setSearchQuery} />
        {status && <div className="p-4 fixed right-1 font-medium top-1 z-50 w-10/12 md:w-3/12 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          {status}
        </div>}
        {error && <ErrorComponent />}
        <div className='w-full px-2 md:px-4 gap-4 pb-10 mt-20 md:mt-20 flex flex-col'>
          <Carousel
            showArrows={false}
            showThumbs={false}
            autoPlay={true}
            infiniteLoop={true}
            showStatus={false}
          >
            {image.map((e, i) => {
              return(
                <img key={`carousel-${i}`} alt='' src={e} />
              )
            })}
          </Carousel>

          <div className='w-full grid gap-4 grid-cols-1 md:grid-cols-5'>
            <div className='md:col-span-1 w-full flex flex-col relative'>
              <div className=' gap-2 font-medium md:sticky top-20 flex flex-col'>
                <div className='w-full flex justify-between gap-6 items-center'>
                  <span onClick={() => {
                    size.width <= 768 ?
                      setShowFilter(!showFilter) :
                      console.log(size.width)
                  }} className='md:text-lg text-sm  bg-red-500 text-white px-4 py-2 md:p-0 md:text-black md:bg-transparent md:rounded-none rounded-full ml-auto md:ml-0'>Filters</span>
                  {(filter.Price || filter.Category || filter.productOrder) && <button onClick={resetFilter} className='border-2 border-red-500 py-1 text-red-500 px-3 text-sm  rounded-full'>Reset</button>}
                </div>
                <Category showFilter={showFilter} data={categories} title='Category' filter={filter} setFilter={setFilter} />
                <Category showFilter={showFilter} data={price} title='Price' filter={filter} setFilter={setFilter} />
                <div className={` w-full gap-2 ${showFilter ? 'flex' : 'hidden'} md:flex mt-4`}>
                  {productOrder.map((e, i) => {
                    return (
                      <span onClick={() => setFilter({ ...filter, productOrder: e })} className={`py-1 px-2 border-2 border-red-500 font-medium rounded-full text-sm text-red-500 cursor-pointer ${filter.productOrder === e ? 'bg-red-500 text-white' : ''}`} key={`productOrder${i}`}>{e}</span>
                    )
                  })}

                </div>
              </div>
            </div>
            <div className='w-full md:col-span-4 gap-5 gap-y-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {products && products.length > 0 ?
                products.map((data, i) => {
                  return (
                    <Card data={data} handleAddToCart={handleAddToCart} key={i} />
                  )
                })
                :
                loading
                  ?
                  <>
                    <CardLoading />
                    <CardLoading />
                    <CardLoading />
                    <CardLoading />
                  </>
                  :
                  <div className='font-medium w-full flex col-span-4 justify-center text-lg'>No Product Found</div>
              }
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
