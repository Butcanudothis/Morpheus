export default function About() {
  return (
      <div className="container mx-auto bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-semibold mb-4">About Morpheus</h1>
          <p className="text-gray-700 mb-6">Your all-in-one client-side file converter powered by WebAssembly.</p>

          <h2 className="text-xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Client-side processing using WebAssembly for speed and security.</li>
              <li>Fast and efficient file conversion with a user-friendly interface.</li>
              <li>Cross-platform compatibility for seamless use on any device.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">Privacy Matters</h2>
          <p className="text-gray-700 mb-6">We prioritize your privacy. Morpheus ensures that your files are converted securely on your device without uploading them to our servers. Your data stays private.</p>

          <p className="text-gray-700">Ready to experience the power of Morpheus? Get started now!</p>
          <a href="/" className="mt-4 inline-block bg-blue-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">Get Started</a>
      </div>
  );
}
