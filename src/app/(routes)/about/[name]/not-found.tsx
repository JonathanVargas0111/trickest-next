import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
            <h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
            <div className="bg-watermelon px-2 text-sm rounded rotate-12 absolute">
                No encontrado
            </div>
            <button className="mt-5">
                <div
                    className="relative inline-block text-sm font-medium text-watermelon group active:to-budGreen focus:outline-none focus:ring"
                >

                    <span className="relative block px-8 py-3 bg-transparent border border-current">
                        <Link href="/about-me/">Volver</Link>
                    </span>
                </div>
            </button>
        </main>
    )
}

