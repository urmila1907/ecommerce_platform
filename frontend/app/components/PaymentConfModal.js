"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const PaymentConfModal = ({ onConfirm, onClose }) => {
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-1/3">
          <Dialog.Title className="text-xl font-semibold">Confirm Order</Dialog.Title>
          <Dialog.Description className="mt-2">
            Are you sure you want to place the order?
          </Dialog.Description>

          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Yes
            </button>
          </div>

          <Dialog.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PaymentConfModal;