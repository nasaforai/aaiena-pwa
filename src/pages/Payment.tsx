import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  GiftIcon,
  Landmark,
  WalletMinimal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Payment() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("google-pay");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getDiscountTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.originalPrice - item.price) * item.quantity,
      0
    );
  };

  const handlePayment = () => {
    navigate("/order-success");
  };

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate("/checkout")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">PAYMENT</h1>
      </div>

      {/* Payment Options */}
      <div className="flex-1 p-4">
        <Accordion
          type="single"
          collapsible
          defaultValue="upi"
          className="w-full"
        >
          {/* UPI Section */}
          <AccordionItem value="upi" className="border-none">
            <AccordionTrigger className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3 hover:no-underline">
              <div className="flex items-center space-x-3">
                <img
                  src="/icons/upi.png"
                  alt="upi logo"
                  width={40}
                  height={15}
                />
                <span className="font-medium">UPI</span>
              </div>
              <span className="text-xs text-gray-600">
                Google Pay, Paytm, Phonepe & More
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {/* Google Pay */}
              <div className="flex items-center space-x-3 p-3 mb-2">
                <input
                  type="radio"
                  name="payment"
                  id="google-pay"
                  checked={selectedPayment === "google-pay"}
                  onChange={() => setSelectedPayment("google-pay")}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex items-center space-x-3">
                  <img
                    src="/icons/gpay.svg"
                    alt="gpay icon"
                    width={26}
                    height={26}
                  />
                  <span className="font-medium">Google Pay</span>
                </div>
              </div>

              {selectedPayment === "google-pay" && (
                <Button
                  onClick={handlePayment}
                  className="w-full bg-gray-900 text-white py-6 rounded-xl font-medium mb-4"
                >
                  Pay $ {getTotal() - 100}
                </Button>
              )}

              {/* Paytm */}
              <div className="flex items-center space-x-3 p-3 mb-2">
                <input
                  type="radio"
                  name="payment"
                  id="paytm"
                  checked={selectedPayment === "paytm"}
                  onChange={() => setSelectedPayment("paytm")}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex items-center space-x-3">
                  <img
                    src="/icons/paytm.svg"
                    alt="paytm icon"
                    width={44}
                    height={12}
                  />
                  <span className="font-medium">Paytm</span>
                </div>
              </div>

              {/* Other UPI */}
              <div className="flex items-center space-x-3 p-3 mb-4">
                <input
                  type="radio"
                  name="payment"
                  id="other-upi"
                  checked={selectedPayment === "other-upi"}
                  onChange={() => setSelectedPayment("other-upi")}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex items-center space-x-3">
                  <img
                    src="/icons/upi.png"
                    alt="upi logo"
                    width={40}
                    height={15}
                  />
                  <span className="font-medium">Other UPI</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Credit/Debit Card Section */}
          <AccordionItem value="card" className="border-none mb-4">
            <AccordionTrigger className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:no-underline">
              <div className="flex items-center space-x-3">
                <CreditCard />
                <span className="font-medium">Credit/Debit Card</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-3">
              <p className="text-gray-600">
                Credit/Debit card options will be shown here.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Net Banking Section */}
          <AccordionItem value="netbanking" className="border-none mb-4">
            <AccordionTrigger className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:no-underline">
              <div className="flex items-center space-x-3">
                <Landmark />
                <span className="font-medium">Net Banking</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-3">
              <p className="text-gray-600">
                Net banking options will be shown here.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Shop now & pay later Section */}
          <AccordionItem value="paylater" className="border-none mb-4">
            <AccordionTrigger className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:no-underline">
              <div className="flex items-center space-x-3">
                <WalletMinimal />
                <span className="font-medium">Shop now & pay later</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-3">
              <p className="text-gray-600">
                Pay later options will be shown here.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Gift Card Section */}
          <AccordionItem value="giftcard" className="border-none mb-4">
            <AccordionTrigger className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:no-underline">
              <div className="flex items-center space-x-3">
                <GiftIcon />
                <span className="font-medium">Have a Gift Card?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-3">
              <p className="text-gray-600">
                Gift card options will be shown here.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Payment Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">PAYMENT DETAILS</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Bag Total</span>
            <span className="font-medium">${getTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-gray-400">
              -${getDiscountTotal()}
            </span>
          </div>
          <div className="text-xs text-gray-500">&lt;COUPON&gt; applied</div>
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging</span>
            <div>
              <span className="text-xs text-gray-400 line-through mr-1">
                $50
              </span>
              <span className="font-medium"> Free</span>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-300 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">TOTAL</span>
              <span className="font-semibold text-gray-900">
                ${getTotal() - 100}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-center text-gray-800">
            You're saving ${getDiscountTotal() + 100} on this order!
          </p>
        </div>
      </div>
    </div>
  );
}
