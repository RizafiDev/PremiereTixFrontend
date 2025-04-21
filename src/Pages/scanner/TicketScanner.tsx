import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

interface TicketData {
  order_id: string;
  film: string;
  cinema: string;
  date: string;
  time: string;
  seats: string;
  price: string;
  studio: string;
  transaction_id: string;
}

const TicketScanner = () => {
  const [scanResult, setScanResult] = useState<TicketData | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false
    );

    const success = (result: string) => {
      try {
        const ticketData: TicketData = JSON.parse(result);
        setScanResult(ticketData);
        setIsScanning(false);
        scanner.clear();
      } catch (error) {
        console.error("Failed to parse QR code data", error);
      }
    };

    const error = (err: string) => {
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [isScanning]);

  const handleRescan = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Ticket Scanner
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isScanning && !scanResult && (
            <div className="p-4">
              <div id="qr-reader" className="mb-4"></div>
              <p className="text-center text-gray-600">
                Scan your ticket QR code to validate
              </p>
            </div>
          )}

          {scanResult && (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {scanResult.film}
                  </h2>
                  <p className="text-gray-600">
                    {scanResult.cinema} - Studio {scanResult.studio}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Valid Ticket
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Order ID
                    </h3>
                    <p className="text-lg font-semibold">
                      {scanResult.order_id}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Date & Time
                    </h3>
                    <p className="text-lg font-semibold">
                      {scanResult.date} • {scanResult.time}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Seats</h3>
                    <p className="text-lg font-semibold">{scanResult.seats}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <p className="text-lg font-semibold">${scanResult.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleRescan}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Scan Another Ticket
                </button>
                <button
                  onClick={() => {
                    // Print logic would go here
                    console.log("Print ticket:", scanResult);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Print Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketScanner;
