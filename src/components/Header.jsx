import React from 'react'

const Header = () => {
  return (
    <div>
       <header className="h-[300px] md:h-[560px] lg:h-[460px] xl:h-[700px] 2xl:h-[780px] bg-no-repeat bg-top bg-cover relative" style={{backgroundImage: "url(/images/bg.webp)"}}>
            <div className="absolute inset-0">
                <div className="container max-w-screen-xl flex justify-end">
                    <a href="/" className="flex items-center justify-center space-x-2 py-5">
                        <img className="h-6 lg:h-10 hover:opacity-90 transition-opacity" src="/logo.webp" alt="incehesap logo" />
                    </a>
                </div>
            </div>
        </header>

    
    </div>
  )
}

export default Header