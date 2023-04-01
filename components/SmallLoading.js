import ReactLoading from 'react-loading'

function SmallLoading() {
  return (
    <div className="z-20 top-0 left-0 w-full h-full right-0 bottom-0 bg-transparent flex justify-center items-center">
        <ReactLoading type='spin' color='#ef4444' height={30} width={30} />
    </div>
  )
}

export default SmallLoading