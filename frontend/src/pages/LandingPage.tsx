import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <>
      <div className={`w-full h-screen flex flex-col justify-start items-center relative bg-linear-to-b from-zinc-800 to-zinc-950 overflow-hidden`}>
        
        <p className={`w-full z-20 text-center text-white text-sm md:text-lg mt-10`}>Welcome to</p>
        <h1 className={`w-full z-20 text-center px-5 text-5xl md:text-7xl pt-5 lg:pt-0 pb-3 font-bold bg-linear-to-b from-white via-gray-400 to-gray-700 bg-clip-text text-transparent`}>Website Support Engine</h1>
        <p className={`w-full md:w-[70%] z-20 text-center text-white text-sm md:text-lg py-5 px-5`}>Retrieve data for your a specific website or chat with integrated chat feature or detailed document download</p>

        <div className={`w-125 h-125 bg-linear-to-br from-gray-500 to-black rounded-full opacity-30 absolute -left-1/2 -top-[20%] z-10`} />
        <div className={`w-125 h-125 bg-linear-to-br from-gray-600 to-black rounded-full opacity-15 absolute -right-1/2 -bottom-[20%] z-10`} />
      
        <Link to='/auth/register' className={`w-auto px-5 py-2 rounded bg-white text-black text-center select-none z-20 cursor-pointer active:opacity-80 duration-150 ease-in-out`}>Get Started</Link>
      </div>
    </>
  )
}

export default LandingPage
