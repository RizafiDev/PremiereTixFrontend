import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

interface TicketData {
  order_id: string;
  film: string;
  cinema: string;
  date: string;
  time: string;
  seats: string; // type is string, not array
  price: string;
  studio: string;
  transaction_id: string;
  photo: string;
}

const TicketScanner = () => {
  const [scanResult, setScanResult] = useState<TicketData | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        qrbox: { width: 250, height: 250 },
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

  const printTicketViaESCPOS = async (ticketData: TicketData) => {
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });

      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();

      const ESC = '\x1B';
      const GS = '\x1D';

      const dateStr = new Date(ticketData.date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });

      const commands = [
        ESC + '@', // Init
        ESC + 'a' + '\x01', // Center
        ESC + 'E' + '\x01', // Bold
        'Premiere Tix\n',
        ESC + 'E' + '\x00',
        '(Solo Paragon)\n',
        ESC + 'a' + '\x00', // Left align
        ESC + 'E' + '\x01',
        `Film   : ${ticketData.film}\n`,
        ESC + '!' + '\x00', // Normal
        ESC + 'E' + '\x00',
        `Date   : ${dateStr}\n`,
        `Time   : ${ticketData.time}\n`,
        `Seat   : ${ticketData.seats}\n`,
        `Studio : ${ticketData.studio}\n`,
        ESC + 'E' + '\x01',
        `Price  : Rp. ${new Intl.NumberFormat('id-ID').format(Number(ticketData.price))}\n`,
        ESC + 'E' + '\x00',
        '\n',
        ESC + 'a' + '\x01',
        'Thank you for your purchase,\n',
        'enjoy!\n',
        '\n\n',
        GS + 'V' + '\x00' // Cut
      ];

      for (const cmd of commands) {
        await writer.write(encoder.encode(cmd));
      }

      writer.releaseLock();
      await port.close();
    } catch (err) {
      alert('Gagal mengirim ke printer melalui COM port.');
      console.error('Printer Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Ticket Scanner
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isScanning && !scanResult && (
            <div className="p-8 flex flex-col items-center justify-center space-y-6">
              <div className="w-40 h-40 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 4.5v3.75m0 7.5V19.5m19.5-15v3.75m0 7.5V19.5M4.5 2.25h3.75m7.5 0H19.5M4.5 21.75h3.75m7.5 0H19.5"
                  />
                </svg>
              </div>
              <div id="qr-reader" className="w-full max-w-sm" />
              <p className="text-center text-gray-600">
                Arahkan kamera ke QR code tiket untuk validasi
              </p>
            </div>
          )}

          {scanResult && (
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 items-start mb-8">
                <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md border border-gray-200">
                  <img
                    src={`http://127.0.0.1:8000/storage/${scanResult.photo}`}
                    alt={`Poster ${scanResult.film}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="flex justify-between items-start">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Seats
                      </h3>
                      <p className="text-lg font-semibold">
                        {scanResult.seats}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Price
                      </h3>
                      <p className="text-lg font-semibold">
                        Rp. {new Intl.NumberFormat("id-ID").format(Number(scanResult.price))}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      onClick={handleRescan}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Scan Another Ticket
                    </button>
                    <button
                      onClick={() => {
                        if (scanResult) {
                          printTicketViaESCPOS(scanResult);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Print Ticket via COM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketScanner;
