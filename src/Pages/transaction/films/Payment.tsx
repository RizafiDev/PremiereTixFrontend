// File: src/pages/transaction/films/Payment.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/stores/useBookingStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowLeftCircleIcon as BackIcon,
  WalletIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import axios from "axios";
import { Dialog } from "@headlessui/react";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (error: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
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

const API_ENDPOINT = "http://127.0.0.1:8000/api/dashboard/ticket-transactions";

function Payment() {
  const navigate = useNavigate();
  const { booking } = useBookingStore();
  const { isAuthenticated, initialize, user } = useAuthStore();
  const [selectedMethod, setSelectedMethod] = useState("midtrans");
  const [authChecked, setAuthChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expiryTime, setExpiryTime] = useState<dayjs.Dayjs | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initialize();
      setAuthChecked(true);
    };
    init();
  }, [initialize]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (expiryTime) {
      const updateCountdown = () => {
        const now = dayjs();
        const diff = expiryTime.diff(now, "second");

        if (diff <= 0) {
          setIsExpired(true);
          setShowExpiredModal(true);
          setRemainingTime("00:00:00");
          clearInterval(interval);
          return;
        }

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setRemainingTime(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      };

      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
    }

    return () => clearInterval(interval);
  }, [expiryTime]);

  const { totalAmount, serviceFee, grandTotal } = useMemo(() => {
    const amount = booking.selectedSeats.length * (booking.price || 0);
    const fee = Math.round(amount * 0.05);
    return {
      totalAmount: amount,
      serviceFee: fee,
      grandTotal: amount + fee,
    };
  }, [booking.selectedSeats.length, booking.price]);

  async function handlePayment() {
    if (!user?.id) return alert("User not authenticated");
    if (!booking.showtimeId) return alert("No showtime selected");
    if (booking.selectedSeats.length === 0) return alert("No seats selected");
    if (isExpired) return setShowExpiredModal(true);

    setIsProcessing(true);

    const orderId = `ORD-${uuidv4()}`;

    try {
      const payload = {
        order_id: orderId,
        appuser_id: user.id,
        schedule_id: booking.showtimeId,
        seats: booking.selectedSeats,
        gross_amount: grandTotal,
        status: "pending",
      };

      const response = await axios.post(API_ENDPOINT, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const transactionId = response.data.data.id;
      const snapToken = response.data.snap_token;
      const expiresAt = response.data.data.expires_at;

      // Set expiry time from API response
      setExpiryTime(dayjs(expiresAt));
      setIsExpired(false);

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async (result) => {
            console.log("Success:", result);

            await Promise.all(
              booking.selectedSeats.map((seat) =>
                axios.put(`http://127.0.0.1:8000/api/dashboard/seats/${seat}`, {
                  schedule_id: booking.showtimeId,
                  seat_code: seat,
                  is_booked: true,
                })
              )
            );

            await axios.put(
              `http://127.0.0.1:8000/api/dashboard/ticket-transactions/${transactionId}`,
              {
                status: "success",
              }
            );

            navigate("/success", { state: { orderId } });
          },
          onPending: (result) => {
            console.log("Pending:", result);
            alert("Transaction pending. Please complete the payment.");
          },
          onError: (error) => {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
          },
          onClose: () => {
            console.log("Payment popup closed");
            alert("You closed the payment popup without finishing.");
          },
        });
      } else {
        alert("Midtrans snap.js not loaded");
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Payment failed: ${error.response.data.message || "Unknown error"}`
        );
      } else {
        alert("An error occurred during payment. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  if (!authChecked || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking.film) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading booking data...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Expired Payment Modal */}
      <Dialog
        open={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
            <Dialog.Title className="text-xl font-bold text-red-600">
              Payment Expired
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">
              Your payment time has expired. Please try again to complete your
              booking.
            </Dialog.Description>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowExpiredModal(false);
                  navigate("/select-seat");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

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
                {dayjs(booking.showtimeTime).format("DD MMM YYYY • HH:mm")}
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
              <span>Price ({booking.selectedSeats.length} tickets)</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Service Fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-3">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          {expiryTime && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                Complete payment in:{" "}
                <span className="text-red-600">{remainingTime}</span>
              </span>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <PaymentMethod
              icon={<WalletIcon className="w-6 h-6" />}
              name="Midtrans"
              selected={selectedMethod === "midtrans"}
              onSelect={() => setSelectedMethod("midtrans")}
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing || isExpired}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors disabled:bg-blue-400"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : isExpired ? (
              "Payment Expired"
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
