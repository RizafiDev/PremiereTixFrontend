declare global {
    interface BluetoothDevice {
      gatt?: BluetoothRemoteGATTServer | null;
    }
  
    interface Navigator {
      bluetooth?: Bluetooth;
    }
  
    interface Bluetooth {
      requestDevice(options: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
    }
  }
  
  export {};
  