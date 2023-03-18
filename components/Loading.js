import ReactLoading from 'react-loading'


function Loading() {
  return (
    <div className="absolute z-20 top-0 left-0 w-full h-full right-0 bottom-0 bg-transparent flex justify-center items-center">
        <ReactLoading type='spinningBubbles' color='#ef4444' height={70} width={70} />
    </div>
  )
}

export default Loading