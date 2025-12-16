
import React, { useState } from 'react';
import { X, Check, Shield, CreditCard, Loader2, Smartphone, Wallet, Globe } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentProvider = 'stripe' | 'paymongo' | 'paypal';

const PaymentModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<PaymentProvider>('stripe'); // 'stripe' (Card), 'paymongo' (E-Wallets), or 'paypal'
  const [paymongoMethod, setPaymongoMethod] = useState<'gcash' | 'grabpay'>('gcash');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Wallet Inputs
  const [walletNumber, setWalletNumber] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Network Request / API Processing
    // In a real app, this would create a PaymentIntent (Stripe) or Source (PayMongo)
    const delay = provider === 'stripe' ? 2000 : 3000;

    setTimeout(() => {
        setLoading(false);
        onSuccess();
    }, delay);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        {/* Left Side: Benefits */}
        <div className="bg-slate-900 text-white p-8 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
             {/* Content */}
             <div className="relative z-10">
                <div className="flex items-center gap-2 text-amber-400 mb-6 font-bold tracking-wide">
                    <Shield size={20} /> PREMIUM ACCESS
                </div>
                <h3 className="text-3xl font-bold mb-3">Upgrade to Pro</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Unlock the full potential of your career with our professional tools.
                </p>
                
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-green-500/10 rounded-full">
                            <Check size={14} className="text-green-400" />
                        </div>
                        <span>Access all 50+ Premium Templates</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-green-500/10 rounded-full">
                            <Check size={14} className="text-green-400" />
                        </div>
                        <span>Remove branding from PDFs</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-green-500/10 rounded-full">
                            <Check size={14} className="text-green-400" />
                        </div>
                        <span>Unlimited High-Res Exports</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-green-500/10 rounded-full">
                            <Check size={14} className="text-green-400" />
                        </div>
                        <span>Priority 24/7 Support</span>
                    </li>
                </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700 relative z-10">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">One-time Payment</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">₱120</span>
                    <span className="text-slate-400">PHP</span>
                </div>
            </div>
             
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="p-8 md:w-3/5 bg-slate-50 relative flex flex-col overflow-y-auto">
             <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
             >
                 <X size={20} />
             </button>

             <div className="mb-6">
                 <h4 className="font-bold text-slate-900 text-lg">Select Payment Method</h4>
                 <p className="text-slate-500 text-sm">Choose how you want to pay securely.</p>
             </div>
             
             {/* Payment Provider Tabs */}
             <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => setProvider('stripe')}
                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        provider === 'stripe' 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    <CreditCard size={24} className="mb-2" />
                    <span className="font-bold text-xs sm:text-sm">Card</span>
                </button>
                
                <button 
                    onClick={() => setProvider('paypal')}
                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        provider === 'paypal' 
                        ? 'border-[#0070BA] bg-blue-50 text-[#0070BA] shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    <span className="font-bold text-2xl italic font-serif mb-1">P</span>
                    <span className="font-bold text-xs sm:text-sm">PayPal</span>
                </button>

                <button 
                    onClick={() => setProvider('paymongo')}
                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        provider === 'paymongo' 
                        ? 'border-green-600 bg-green-50 text-green-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    <Wallet size={24} className="mb-2" />
                    <span className="font-bold text-xs sm:text-sm">E-Wallet</span>
                </button>
             </div>

             <form onSubmit={provider === 'paypal' ? undefined : handlePayment} className="space-y-5 flex-1 flex flex-col">
                {/* Stripe Form */}
                {provider === 'stripe' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Cardholder Name</label>
                            <input 
                                required
                                type="text" 
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Card Number</label>
                            <div className="relative">
                                <input 
                                    required
                                    type="text" 
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full p-3 pl-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-shadow"
                                />
                                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Expiry Date</label>
                                <input 
                                    required
                                    type="text" 
                                    value={expiry}
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, '');
                                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                        setExpiry(v.slice(0, 5));
                                    }}
                                    placeholder="MM/YY"
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">CVC</label>
                                <input 
                                    required
                                    type="text" 
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="123"
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono transition-shadow"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <Shield size={14} className="text-blue-600" />
                            Transaction secured by <strong>Stripe</strong> using 256-bit encryption.
                        </div>
                    </div>
                )}

{provider === 'paypal' && (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 py-6">
    <div className="text-center">
      <div className="w-20 h-20 bg-[#0070BA]/10 text-[#0070BA] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0070BA]/20">
        <span className="font-bold text-4xl italic font-serif">P</span>
      </div>
      <h4 className="font-bold text-slate-900 text-xl mb-2">Pay with PayPal</h4>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        You will be redirected to PayPal to complete your subscription securely.
      </p>
    </div>

    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        intent: "subscription",
        vault: true,
        currency: "PHP",
      }}
    >
      <div className="max-w-sm mx-auto">
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "subscribe",
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: "P-82T3832349751134ENE7H7OY",
            });
          }}
          onApprove={(data) => {
            console.log("Subscription ID:", data.subscriptionID);
            onSuccess();
          }}
        />
      </div>
    </PayPalScriptProvider>
  </div>
)}

                {/* PayMongo Form */}
                {provider === 'paymongo' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Select Wallet</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymongoMethod('gcash')}
                                    className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${
                                        paymongoMethod === 'gcash'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                                    }`}
                                >
                                    <Smartphone size={16} /> GCash
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymongoMethod('grabpay')}
                                    className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 font-bold text-sm transition-colors ${
                                        paymongoMethod === 'grabpay'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                                    }`}
                                >
                                    <Globe size={16} /> GrabPay
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Mobile Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">+63</span>
                                <input 
                                    required
                                    type="text"
                                    value={walletNumber}
                                    onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="900 000 0000"
                                    className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none font-mono transition-shadow"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1.5">
                                You will be redirected to {paymongoMethod === 'gcash' ? 'GCash' : 'GrabPay'} to authenticate and complete your payment.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                            <Shield size={14} className="text-green-600" />
                            Processed securely via <strong>PayMongo</strong>.
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                            provider === 'stripe' 
                            ? 'bg-slate-900 hover:bg-black hover:shadow-slate-900/20' 
                            : provider === 'paypal'
                            ? 'bg-[#0070BA] hover:bg-[#003087] hover:shadow-blue-900/20'
                            : 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/20'
                        }`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            provider === 'stripe' ? 'Pay ₱120.00' 
                            : provider === 'paypal' ? 'Continue to PayPal'
                            : `Pay via ${paymongoMethod === 'gcash' ? 'GCash' : 'GrabPay'}`
                        )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-3">
                        By clicking pay, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
             </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
