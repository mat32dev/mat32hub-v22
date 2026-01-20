
import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, cartTotal } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      ></div>

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-mat-900 border-l border-mat-700 shadow-2xl z-50 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-mat-700 flex justify-between items-center bg-mat-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-mat-500" />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">{t('cart.title')}</h2>
          </div>
          <button onClick={toggleCart} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="uppercase tracking-wider text-sm font-bold">{t('cart.empty')}</p>
              <p className="text-xs mt-2">{t('cart.empty.desc')}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-mat-800 p-3 border border-mat-700 group">
                <div className="w-16 h-16 flex-shrink-0 bg-black">
                  <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-sm uppercase truncate">{item.title}</h4>
                  <p className="text-mat-500 text-xs uppercase tracking-wide truncate">{item.artist}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-xs">Qty: {item.quantity}</span>
                    <span className="text-white font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-mat-800 border-t border-mat-700">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 uppercase text-xs tracking-widest">{t('cart.subtotal')}</span>
            <span className="text-2xl font-black text-mat-cream">${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-mat-500 hover:bg-mat-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mb-3"
          >
            {t('cart.checkout')} <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-center text-[10px] text-gray-500 uppercase tracking-wider">
            {t('cart.secured')}
          </p>
        </div>
      </div>
    </>
  );
};
