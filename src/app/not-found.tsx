import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-8xl font-bold text-orange-500">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="btn-primary px-8 py-3 rounded-full font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
