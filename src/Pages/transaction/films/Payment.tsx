import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/stores/useBookingStore";
import {
  ArrowLeftCircleIcon as BackIcon,
  WalletIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";

declare global {
  interface Window {
    snap: any;
  }
}

function PaymentMethod({
  icon,
  name,
  selected,
  onSelect,
}: {
  icon: React.ReactNode;
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
      onClick={onSelect}
    >
      {icon}
      <span className="font-medium">{name}</span>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function Payment() {
  const navigate = useNavigate();
  const { booking, resetBooking } = useBookingStore();
  const [selectedMethod, setSelectedMethod] = useState("creditCard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Redirect if essential booking data is missing
    if (
      !booking.film ||
      !booking.showtimeId ||
      booking.selectedSeats.length === 0
    ) {
      navigate("/");
    }
  }, [booking, navigate]);

  const totalAmount = booking.selectedSeats.length * (booking.price || 0);
  const serviceFee = Math.round(totalAmount * 0.05); // 5% service fee
  const grandTotal = totalAmount + serviceFee;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Panggil API dummy untuk mendapatkan token
      const response = await fetch(
        "http://localhost:5000/generate-dummy-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: `ORDER-${new Date().getTime()}`,
            grossAmount: grandTotal,
          }),
        }
      );

      const data = await response.json();

      if (data.token) {
        // Memunculkan Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log("Payment success:", result);
            setIsComplete(true);
          },
          onPending: function (result: any) {
            console.log("Payment pending:", result);
          },
          onError: function (result: any) {
            console.error("Payment error:", result);
          },
          onClose: function () {
            console.log("Payment popup closed");
          },
        });
      }
    } catch (error) {
      console.error("Error during payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!booking.film) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-xl mb-6">Your tickets have been booked</p>
        <div className="text-center mb-8">
          <p className="font-medium">{booking.film.title}</p>
          <p>
            {dayjs(booking.showtimeTime).format("dddd, DD MMMM YYYY • HH:mm")}
          </p>
          <p>Seats: {booking.selectedSeats.join(", ")}</p>
        </div>
        <p className="text-gray-600">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <BackIcon
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate("/select-seat")}
        />
        <h1 className="text-2xl font-bold">Payment</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex items-start gap-4 mb-6">
            <img
              src={booking.film.photo}
              alt={booking.film.title}
              className="w-24 rounded-lg"
            />
            <div>
              <h3 className="font-bold text-lg">{booking.film.title}</h3>
              <p className="text-gray-600">
                {booking.cinema?.name} • Studio {booking.studio}
              </p>
              <p className="text-gray-600">
                {booking.showtimeTime
                  ? dayjs(booking.showtimeTime).format("DD MMM YYYY • HH:mm")
                  : ""}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Selected Seats</h3>
            <div className="flex flex-wrap gap-2">
              {booking.selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                Price ({booking.selectedSeats.length} tickets)
              </span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service Fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-3">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          <div className="space-y-3 mb-6">
            <PaymentMethod
              icon={<WalletIcon className="w-6 h-6" />}
              name="Mid Trans"
              selected={selectedMethod === "midtrans"}
              onSelect={() => setSelectedMethod("midtrans")}
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(grandTotal)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
