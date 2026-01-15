'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Layout, Card, Button } from '@/app/_components/Layout';
import { ArrowLeft, AlertTriangle, Ban, Package } from 'lucide-react';

function RestrictionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const handleGoBack = () => {
    router.push(`/f88${phone ? `?phone=${encodeURIComponent(phone)}` : ''}`);
  };

  return (
    <Layout title="Restrictions & Prohibitions" onBack={handleGoBack} showMenu>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center py-2">
          <h1 className="text-lg font-bold text-gray-900">Import Restrictions & Prohibitions</h1>
          <p className="text-xs text-gray-600 mt-1">
            East African Community Customs Management Act
          </p>
        </div>

        {/* Prohibited Items */}
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-3">
            <Ban className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-red-900">1. Prohibited Items</h2>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Items completely banned from import/export under the 2nd and 3rd Schedule of the Act:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>False money and counterfeit currency (notes & coins)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Pornographic materials in all media formats</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Distilled beverages harmful to health</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Used tyres for light commercial vehicles & passenger cars</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Matches containing white phosphorous</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Narcotic drugs under international control</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Hazardous wastes and their disposal materials</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>All soaps and cosmetic products containing mercury</span>
            </li>
          </ul>
        </Card>

        {/* Restricted Items */}
        <Card className="p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-orange-900">2. Restricted Items</h2>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Items requiring special permits or documentation:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Live animals including pets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Plants and plant products</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Explosives</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Wildlife products (e.g., ivory)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Precious metals and stones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Arms, ammunition, and accessories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Drones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Bows and arrows</span>
            </li>
          </ul>
        </Card>

        {/* Duty-Free Allowance */}
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-blue-900">3. Duty-Free Allowance Limits</h2>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Items exceeding these limits require duty payment (passengers 18+ years only):
          </p>
          <div className="space-y-2 text-xs">
            <div className="bg-blue-50 p-2 rounded-lg">
              <span className="font-semibold text-blue-800">Spirits/Wine:</span>
              <span className="text-gray-700"> Max 1 litre spirits OR 2 litres wine</span>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <span className="font-semibold text-blue-800">Perfume:</span>
              <span className="text-gray-700"> Max 0.5 litre total (max 0.25 litre perfume)</span>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <span className="font-semibold text-blue-800">Tobacco:</span>
              <span className="text-gray-700"> Max 250g combined (cigarettes, cigars, snuff)</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            Note: Duty-free allowance only applies to passengers aged 18 years and above.
          </p>
        </Card>

        {/* Back Button */}
        <Button 
          onClick={handleGoBack}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Declaration Form
        </Button>
      </div>
    </Layout>
  );
}

export default function RestrictionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--kra-red)] border-t-transparent rounded-full"></div>
      </div>
    }>
      <RestrictionsContent />
    </Suspense>
  );
}
