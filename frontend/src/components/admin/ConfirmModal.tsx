/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  type = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const accentColorClass = 
    type === "danger" 
      ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" 
      : type === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
      : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";

  const btnConfirmColor = 
    type === "danger" 
      ? "bg-red-600 hover:bg-red-700 text-white" 
      : type === "warning"
      ? "bg-[#775a19] hover:bg-[#5e4713] text-white"
      : "bg-[#1b1c1c] hover:bg-black text-white";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="confirm-modal-wrapper">
      {/* Dimmed glass overlay */}
      <div 
        onClick={onCancel}
        className="fixed inset-0 bg-[#1b1c1c]/50 backdrop-blur-sm transition-opacity duration-300"
        id="confirm-modal-overlay"
      />
      
      {/* Modal card */}
      <div 
        className="relative bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl border border-[#c4c7c7]/30 max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 animate-in zoom-in-95"
        id="confirm-modal-content-card"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`p-4 rounded-full border ${accentColorClass}`} id="confirm-icon-box">
            {type === "danger" || type === "warning" ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <HelpCircle className="w-8 h-8" />
            )}
          </div>
          
          <h3 
            className="font-display text-2xl font-bold text-[#1b1c1c] tracking-tight" 
            id="confirm-modal-title"
          >
            {title}
          </h3>
          
          <p 
            className="font-sans text-sm text-[#444748] leading-relaxed" 
            id="confirm-modal-message"
          >
            {message}
          </p>
          
          <div className="flex gap-4 w-full mt-6" id="confirm-modal-actions-container">
            <button
              id="confirm-modal-cancel-btn"
              onClick={onCancel}
              className="flex-1 py-3 border border-[#c4c7c7]/60 text-[#444748] rounded-xl font-sans text-xs tracking-wider uppercase font-semibold hover:bg-[#efeded]/50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              id="confirm-modal-submit-btn"
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-xl font-sans text-xs tracking-wider uppercase font-semibold shadow-md transition-colors ${btnConfirmColor}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
