// imports
import Dropzone from '@/components/dropzone';

export default function Home() {
    return (
        <main
            className="flex flex-col items-center justify-center w-full flex-1 px-20
     text-center gap-5"
        >
            <h1
                className="text-3xl font-bold xs:text-xl md:text-3xl lg:text-5xl
      "
            >
                Welcome to <span className="text-blue-600">Morpheus!</span>
            </h1>
            <p
                className="mt-3 text-xl xs:text-sm md:text-xl lg:text-2xl text-gray-500
      "
            >
                Your private file converter, take back your privacy.
            </p>
            <Dropzone />
        </main>
    );
}
