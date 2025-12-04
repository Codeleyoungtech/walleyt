export const Modal = {
  show({
    title,
    content,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
  }) {
    const existingModal = document.querySelector(".modal-overlay-ios");
    if (existingModal) existingModal.remove();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay-ios";

    overlay.innerHTML = `
      <div class="modal-ios">
        <div class="modal-ios-header">
          <h3 class="modal-ios-title">${title}</h3>
        </div>
        <div class="modal-ios-content">
          ${content}
        </div>
        <div class="modal-ios-actions">
          <button class="modal-ios-btn modal-ios-cancel">${cancelText}</button>
          <button class="modal-ios-btn modal-ios-confirm">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animation
    requestAnimationFrame(() => {
      overlay.classList.add("show");
    });

    // Auto-focus first input if exists
    const firstInput = overlay.querySelector("input, textarea");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    // Event Listeners
    const close = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector(".modal-ios-cancel").onclick = close;
    overlay.querySelector(".modal-ios-confirm").onclick = () => {
      if (onConfirm) {
        if (onConfirm() !== false) {
          close();
        }
      } else {
        close();
      }
    };

    // Close on backdrop click
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };

    // Prevent clicks inside modal from closing
    overlay.querySelector(".modal-ios").onclick = (e) => {
      e.stopPropagation();
    };
  },
};
