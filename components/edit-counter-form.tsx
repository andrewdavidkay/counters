"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCounterName, deleteCounter } from "@/components/counter-actions";

interface Counter {
  id: string;
  name: string;
  value: number;
}

interface EditCounterFormProps {
  counter: Counter;
  username: string;
}

export default function EditCounterForm({
  counter,
  username,
}: EditCounterFormProps) {
  const [name, setName] = useState(counter.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Counter name is required");
      setIsSubmitting(false);
      return;
    }

    if (trimmedName === counter.name) {
      // No changes made, redirect back
      router.push(`/${username}/counter/${counter.id}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", counter.id);
      formData.append("name", trimmedName);

      await updateCounterName(formData);

      // Redirect to the counter page
      router.push(`/${username}/counter/${counter.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update counter"
      );
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("id", counter.id);

      await deleteCounter(formData);

      // Redirect to user's profile page
      router.push(`/${username}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete counter"
      );
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${username}/counter/${counter.id}`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Counter Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter counter name"
            disabled={isSubmitting || isDeleting}
            autoFocus
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              isSubmitting || !name.trim() || name.trim() === counter.name
            }
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Updating..." : "Update Counter"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting || isDeleting}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Delete section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Delete Counter
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              This action cannot be undone. This will permanently delete the
              counter and all its activity logs.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting || isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Delete Counter
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-600 font-medium">
                Are you sure you want to delete "{counter.name}"?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting || isDeleting}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
