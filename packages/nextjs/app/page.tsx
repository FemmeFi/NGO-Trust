// packages/nextjs/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">NGO Transparency Platform</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and verify NGOs on the blockchain with complete transparency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card bg-white shadow-2xl border border-gray-200">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="card-title justify-center text-2xl mb-4">Search NGOs</h2>
              <p className="text-gray-600 mb-6">Browse all registered NGOs and view their transparent profiles</p>
              <Link href="/search" className="btn btn-primary w-full">
                Explore NGOs
              </Link>
            </div>
          </div>

          <div className="card bg-white shadow-2xl border border-gray-200">
            <div className="card-body text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h2 className="card-title justify-center text-2xl mb-4">Register NGO</h2>
              <p className="text-gray-600 mb-6">Register your organization to build trust with donors and supporters</p>
              <Link href="/register" className="btn btn-secondary w-full">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
