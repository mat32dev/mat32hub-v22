import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { CheckCircle, CreditCard, ShoppingBag, Lock, ArrowRight, AlertCircle, Loader2, MapPin, Truck } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { stripeService } from '../services/stripeService';
import { dataService } from '../services/dataService';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');

  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const shippingCost = deliveryMethod === 'shipping' ? 5 : 0;
  const finalTotal = cartTotal + shippingCost;

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'number') formatted = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    if (name === 'expiry') formatted = value.replace(/\s?/g, '').replace(/(\d{2})/g, '$1/').replace(/\/$/, '').substr(0, 5);
    if (name === 'cvc') formatted = value.replace(/\D/g, '').substr(0, 4);

    setCardData(prev => ({ ...prev, [name]: formatted }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripeService.validateCard(cardData.number, cardData.expiry, cardData.cvc)) {
      setError(t('contact.error.invalid_email') === 'Invalid email format.' ? "Please check your payment details." : "Por favor, revisa los datos de pago.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const confirmed = await stripeService.confirmPayment("mock_pm_123");
      if (confirmed) {
        await dataService.recordSale({
          items: cart,
          total: finalTotal,
          deliveryMethod,
          timestamp: new Date().toISOString(),
          type: cart.some(i => i.id.startsWith('ticket')) ? 'ticket' : 'record'
        });
        setIsSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
      } else {
        setError("Payment declined. Please try another card.");
      }
    } catch (err) {
      setError("A technical error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-mat-900 flex items-center justify-center p-6">
        <SEO titleKey="checkout.success" descriptionKey="seo.home.description" />
        <div className="max-w-lg w-full bg-mat-800 p-10 border-2 border-mat-500 shadow-2xl text-center animate-fade-in rounded-[3rem]">
           <div className="w-24 h-24 bg-mat-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-mat-700 shadow-inner">
              <CheckCircle className="w-12 h-12 text-mat-500" />
           </div>
           <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{t('checkout.success')}</h1>
           <p className="text-gray-400 mb-8 leading-relaxed italic">
             {deliveryMethod === 'pickup' 
               ? "Tu pedido está confirmado. Pásate por Mat32 (Ruzafa) con tu DNI para recogerlo."
               : "Your order has been completed successfully."}
           </p>
           <Link to="/" className="inline-block px-12 py-4 bg-mat-500 text-white font-bold uppercase tracking-widest hover:bg-mat-400 transition-colors clip-path-slant shadow-xl">
             Volver al Inicio
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mat-900 text-gray-100">
      <SEO titleKey="nav.records" descriptionKey="seo.home.description" />
      <div className="bg-mat-800 py-16 md:py-24 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4 text-mat-500">
             <Lock className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Pago Seguro con Encriptación AES-256</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white font-exo leading-none">Finalizar Pedido</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12 md:gap-16">
          
          <div className="lg:col-span-8">
             <form onSubmit={handlePlaceOrder} className="space-y-8 md:space-y-12">
                
                {/* DELIVERY METHOD SELECTOR */}
                <div className="bg-mat-800 p-8 md:p-12 border-2 border-mat-700 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8 md:mb-10 flex items-center gap-4">
                     <span className="w-8 h-8 bg-mat-500 text-mat-900 rounded-full flex items-center justify-center text-sm font-black font-exo">1</span>
                     Método de Entrega
                   </h2>
                   
                   <div className="grid md:grid-cols-2 gap-6">
                      <button 
                        type="button"
                        onClick={() => setDeliveryMethod('shipping')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center ${deliveryMethod === 'shipping' ? 'border-mat-500 bg-mat-500/10' : 'border-mat-700 bg-mat-900/50 text-gray-500'}`}
                      >
                         <Truck size={32} className={deliveryMethod === 'shipping' ? 'text-mat-500' : ''} />
                         <div>
                            <span className="block font-black uppercase text-xs tracking-widest text-white">Envío Estándar</span>
                            <span className="text-[10px] italic">€5.00 • 2-3 días hábiles</span>
                         </div>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center ${deliveryMethod === 'pickup' ? 'border-mat-500 bg-mat-500/10' : 'border-mat-700 bg-mat-900/50 text-gray-500'}`}
                      >
                         <MapPin size={32} className={deliveryMethod === 'pickup' ? 'text-mat-500' : ''} />
                         <div>
                            <span className="block font-black uppercase text-xs tracking-widest text-white">Click & Collect</span>
                            <span className="text-[10px] italic text-emerald-500 font-black">GRATIS • Recogida en local</span>
                         </div>
                      </button>
                   </div>
                </div>

                {deliveryMethod === 'shipping' && (
                  <div className="bg-mat-800 p-8 md:p-12 border-2 border-mat-700 shadow-2xl rounded-[2.5rem] relative overflow-hidden animate-fade-in">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8 md:mb-10 flex items-center gap-4">
                      <span className="w-8 h-8 bg-mat-500 text-mat-900 rounded-full flex items-center justify-center text-sm font-black font-exo">2</span>
                      Información de Envío
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">Nombre Completo</label>
                          <input required={deliveryMethod === 'shipping'} name="name" type="text" onChange={handleCardInput} className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none uppercase text-xs font-bold rounded-xl" placeholder="COMO APARECE EN LA DIRECCIÓN" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">Email de Contacto</label>
                          <input required type="email" className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none uppercase text-xs font-bold rounded-xl" placeholder="EMAIL@EXAMPLE.COM" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">Dirección de Entrega</label>
                        <input required={deliveryMethod === 'shipping'} type="text" className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none uppercase text-xs font-bold rounded-xl" placeholder="CALLE, NÚMERO, PISO" />
                    </div>
                  </div>
                )}

                <div className="bg-mat-800 p-8 md:p-12 border-2 border-mat-700 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8 md:mb-10 flex items-center gap-4">
                     <span className="w-8 h-8 bg-mat-500 text-mat-900 rounded-full flex items-center justify-center text-sm font-black font-exo">{deliveryMethod === 'shipping' ? '3' : '2'}</span>
                     Método de Pago
                   </h2>
                   
                   {error && (
                     <div className="p-5 bg-red-500/10 border border-red-500 text-red-500 mb-8 flex items-center gap-4 rounded-2xl animate-fade-in shadow-xl">
                        <AlertCircle className="w-6 h-6" />
                        <span className="text-xs font-black uppercase tracking-widest leading-none">{error}</span>
                     </div>
                   )}

                   <div className="mb-8 space-y-2">
                      <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">Número de Tarjeta</label>
                      <div className="relative">
                         <input 
                            required 
                            name="number"
                            value={cardData.number}
                            onChange={handleCardInput}
                            type="text" 
                            placeholder="0000 0000 0000 0000" 
                            className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none pl-12 font-mono text-lg rounded-xl" 
                         />
                         <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-500 w-5 h-5" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">Expiración</label>
                         <input 
                            required 
                            name="expiry"
                            value={cardData.expiry}
                            onChange={handleCardInput}
                            type="text" 
                            placeholder="MM/YY" 
                            className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none font-mono text-lg rounded-xl" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">CVC</label>
                         <input 
                            required 
                            name="cvc"
                            value={cardData.cvc}
                            onChange={handleCardInput}
                            type="text" 
                            placeholder="123" 
                            className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none font-mono text-lg rounded-xl" 
                         />
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-mat-500 hover:bg-mat-400 text-white font-black py-7 md:py-10 uppercase tracking-[0.4em] transition-all shadow-[0_20px_60px_rgba(234,88,12,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-sm md:text-base clip-path-slant"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin" />
                      Procesando Transacción...
                    </>
                  ) : (
                    <>
                      Confirmar Compra <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
             </form>
          </div>

          <div className="lg:col-span-4">
             <div className="bg-mat-800 p-8 border-2 border-mat-700 shadow-2xl rounded-[3rem] sticky top-28 overflow-hidden group">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-8 border-b-2 border-mat-700 pb-6 font-exo">Resumen de Caja</h3>
                <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                   {cart.map(item => (
                      <div key={item.id} className="flex gap-4 group/item">
                         <div className="w-16 h-16 bg-black flex-shrink-0 rounded-xl overflow-hidden border border-mat-700">
                            <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-white font-black text-xs uppercase truncate tracking-tight">{item.title}</p>
                            <p className="text-mat-500 text-[9px] font-black uppercase tracking-widest truncate">{item.artist}</p>
                            <div className="flex justify-between mt-2">
                               <span className="text-gray-500 text-[10px] font-black">CANT: {item.quantity}</span>
                               <span className="text-mat-cream font-mono text-xs font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                
                <div className="border-t-2 border-dashed border-mat-700 pt-8 space-y-4">
                   <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="font-mono text-gray-300">€{cartTotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-widest">
                      <span>Gastos de Envío</span>
                      <span className={`font-mono ${deliveryMethod === 'pickup' ? 'text-emerald-500' : 'text-gray-300'}`}>
                        {deliveryMethod === 'pickup' ? 'GRATIS' : `€${shippingCost.toFixed(2)}`}
                      </span>
                   </div>
                   <div className="flex justify-between items-end pt-6 border-t border-mat-700/50">
                      <span className="text-xs font-black text-white uppercase tracking-widest">Total Final</span>
                      <div className="text-right">
                         <span className="text-5xl font-black text-mat-500 font-exo block leading-none tracking-tighter">€{finalTotal.toFixed(2)}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};