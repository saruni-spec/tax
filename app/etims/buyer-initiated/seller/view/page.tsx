'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout, Card, Button, TotalsCard, IdentityStrip } from '../../../_components/Layout';
import { calculateTotals } from '../../../_lib/store'; // Keep calculateTotals or implement locally
import { fetchInvoices, processBuyerInvoice } from '../../../../actions/etims';
import { FetchedInvoice } from '../../../_lib/definitions';
import { Loader2 } from 'lucide-react';

function BuyerViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const phone = searchParams.get('phone');
  
  const [invoice, setInvoice] = useState<FetchedInvoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !phone) {
        setIsLoading(false);
        if (!phone) setError('Phone number missing');
        else setError('Invoice ID missing');
        return;
    }

    const loadInvoice = async () => {
        try {
            // Since we don't have getInvoiceById, we fetch all and find
            const result = await fetchInvoices(phone);
            if (result.success && result.invoices) {
                const found = result.invoices.find(inv => 
                    inv.reference === id || inv.invoice_id === id || 
                    (inv as any).invoiceRef === id // Handle potential inconsistencies
                );
                
                if (found) {
                    setInvoice(found);
                } else {
                    setError('Invoice not found');
                }
            } else {
                setError(result.error || 'Failed to fetch invoices');
            }
        } catch (err: any) {
            setError(err.message || 'Error loading invoice');
        } finally {
            setIsLoading(false);
        }
    };

    loadInvoice();
  }, [id, phone]);

  const handleProcess = async (action: 'accept' | 'reject') => {
    if (!invoice || !phone || !id) return;
    setIsProcessing(true);
    
    try {
        await processBuyerInvoice(phone, id, action); // Use ID or reference? Using id from param which matched
        router.push(`/etims/buyer-initiated/buyer/success?action=${action}`);
    } catch (err: any) {
        alert(`Failed to ${action} invoice: ${err.message}`);
        setIsProcessing(false);
    }
  };

  const handleAccept = () => handleProcess('accept');
  
  // For reject, maybe we want to go to a reject page for reason?
  // Current implementation went to /reject page.
  // If API supports simple reject, we can do it here. If it needs reason, we go to reject page.
  // The processBuyerInvoice in actions/etims.ts just sends action='reject'.
  // Postman doesn't show reason in body for accept/reject action.
  // So I'll implement it directly here for now.
  const handleReject = () => handleProcess('reject');

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !invoice) {
    return (
        <Layout title="Error" onBack={() => router.back()}>
            <Card className="p-8 text-center">
                <p className="text-red-600">{error || 'Invoice not found'}</p>
                <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
            </Card>
        </Layout>
    );
  }

  // Calculate totals
  const subtotal = invoice.total_amount; // API returns subtotal? No, usually total_amount.
  // If API returns items, we can calc.
  // FetchedInvoice has items: { quantity, unit_price }
  let calculatedSubtotal = 0;
  if (invoice.items) {
      calculatedSubtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }
  const tax = calculatedSubtotal * 0.16; // Estimate tax? Or assume total_amount includes tax?
  // The API result `total_amount` is likely the final amount.
  // I'll display total_amount. Breaking down tax might be inaccurate if I don't know tax status.
  // But TotalsCard expects subtotal, tax, total.
  // I'll use invoice.total_amount as total. Calculate tax backwards or just 0 if unknown.

  // Calculate totals locally or use API total
  // const totals = calculateTotals(invoice.items || []); // Removed due to type mismatch

  return (
    <Layout 
      title="Invoice Details" 
      step={invoice.status === 'pending' ? 'Action Required' : 'View Only'}
      onBack={() => router.push('/etims/buyer-initiated/buyer/pending')}
    >
      <div className="space-y-6">
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-xs text-amber-800 font-medium">This flow is only for testing</p>
        </div>

        {/* Header Section */}
        <div className="space-y-4">
             {/* Buyer & Supplier */}
             <div className="grid grid-cols-1 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Buyer (You)</p>
                    <p className="text-gray-900 font-medium text-lg">{invoice.buyer_name || 'N/A'}</p>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Supplier</p>
                    <p className="text-gray-900 font-medium text-lg">{invoice.seller_name || 'N/A'}</p>
                </Card>
             </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-gray-900 font-medium">Items</h3>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{invoice.items ? invoice.items.length : 0}</span>
            </div>
            <div className="divide-y divide-gray-100">
                {invoice.items && invoice.items.map((item, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="text-gray-900 font-medium">{item.item_name}</h4>
                        <span className="text-gray-900 font-semibold">KES {(item.unit_price * item.quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Rate: {item.unit_price.toLocaleString()}</span>
                        <span>Qty: {item.quantity}</span>
                    </div>
                </div>
                ))}
            </div>
            {/* Total Section */}
            <div className="bg-gray-900 p-4 text-white">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-2xl font-bold">KES {invoice.total_amount.toLocaleString()}</span>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
            <Button variant="secondary" className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50" onClick={() => alert('PDF Download Mock')}>
                Download PDF
            </Button>

            {isProcessing ? (
                <Card className="bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-center gap-3 py-4">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        <p className="text-blue-900 font-medium">Processing...</p>
                    </div>
                </Card>
            ) : (
                <>
                    {invoice.status === 'pending' || !invoice.status ? (
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="danger" onClick={handleReject}>
                                Reject
                            </Button>
                            <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700 text-white">
                                Accept Invoice
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                            Status: <span className="font-medium uppercase">{invoice.status}</span>
                        </div>
                    )}
                </>
            )}

            <button 
                onClick={() => router.push('/etims/buyer-initiated/buyer/pending')}
                className="w-full text-center text-blue-600 text-sm font-medium hover:underline py-2"
            >
                ← Go Back to Invoices
            </button>
        </div>
      </div>
    </Layout>
  );
}

export default function BuyerInitiatedBuyerView() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BuyerViewContent />
    </Suspense>
  );
}
