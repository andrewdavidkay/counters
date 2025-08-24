"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { createCounter } from "@/components/counter-actions";

interface CreateCounterModalProps {
  onCounterCreated: () => void;
}

export default function CreateCounterModal({
  onCounterCreated,
}: CreateCounterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createCounter(formData);
      setIsOpen(false);
      onCounterCreated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create counter"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Create Counter
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md mx-4">
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Create New Counter
            </Dialog.Title>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="counter-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Counter Name
                </label>
                <input
                  type="text"
                  id="counter-name"
                  name="name"
                  placeholder="Enter counter name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Creating..." : "Create Counter"}
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
