'use client';

import { useRouter } from 'next/navigation';
import { FileText, FileMinus, UserCheck } from 'lucide-react';
import { Layout, Card } from './_components/Layout';
import { clearSalesInvoice, clearCreditNote, clearBuyerInitiated } from './_lib/store';

export default function EtimsHome() {
  const router = useRouter();

  const actionCards = [
    {
      title: 'Sales Invoice',
      description: 'Create sales invoices',
      icon: FileText,
      color: 'blue' as const,
      onClick: () => {
        clearSalesInvoice();
        router.push('/etims/sales-invoice/buyer');
      },
    },
    {
      title: 'Credit Note',
      description: 'Full or partial credit notes',
      icon: FileMinus,
      color: 'green' as const,
      onClick: () => {
        clearCreditNote();
        router.push('/etims/credit-note/search');
      },
    },
    {
      title: 'Buyer Initiated',
      description: 'Buyer-seller invoice approvals',
      icon: UserCheck,
      color: 'purple' as const,
      onClick: () => {
        clearBuyerInitiated();
        router.push('/etims/buyer-initiated');
      },
    },
  ];

  const colorClasses = {
    blue: {
      card: 'bg-blue-50 border-blue-200',
      icon: 'bg-blue-100',
      text: 'text-blue-600',
    },
    green: {
      card: 'bg-green-50 border-green-200',
      icon: 'bg-green-100',
      text: 'text-green-600',
    },
    purple: {
      card: 'bg-purple-50 border-purple-200',
      icon: 'bg-purple-100',
      text: 'text-purple-600',
    },
  };

  return (
    <Layout title="eTIMS Home" showMenu={false}>
      <div className="space-y-4">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/kra_logo.png" alt="KRA Logo" className="h-14 w-auto" />
        </div>

        {/* Action Cards - Vertical on mobile, horizontal on larger screens */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {actionCards.map((card) => {
            const Icon = card.icon;
            const colors = colorClasses[card.color];

            return (
              <button
                key={card.title}
                onClick={card.onClick}
                className="text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Card className={`h-full ${colors.card} !p-3`}>
                  <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                    <div className={`p-3 rounded-full ${colors.icon} flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-900 font-medium">{card.title}</h3>
                      <p className="text-xs text-gray-500">{card.description}</p>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Guides & Help */}
        <Card className="bg-gray-50 border-gray-300 !p-3">
          <h3 className="text-sm text-gray-900 font-medium mb-1">Guides & Help</h3>
          <p className="text-xs text-gray-600">
            Need assistance? Contact support for help with eTIMS features.
          </p>
        </Card>

       
      </div>
    </Layout>
  );
}
