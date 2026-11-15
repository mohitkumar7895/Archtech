"use client";

import React, { useEffect, useRef, useId } from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  title = "Confirm Deletion",
  itemName = "this item",
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onCancel}
      className="w-[calc(100%-1.5rem)] sm:w-full max-w-md m-auto rounded-2xl bg-white p-6 text-[#172033] shadow-2xl border border-red-200 backdrop:bg-[#071A35]/70"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 id={titleId} className="font-serif text-lg font-bold text-[#071A35] mb-1">
            {title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete <strong>{itemName}</strong> from the MySQL database? This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        {/* Per modern-web-guidance dialog rule: autofocus on the safe Cancel action in destructive confirmation */}
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-60 transition"
        >
          {isDeleting ? "Deleting..." : "Delete Permanently"}
        </button>
      </div>
    </dialog>
  );
}
