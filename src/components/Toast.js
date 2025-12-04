export const Toast = {
  show(message, type = "info") {
    const container =
      document.getElementById("toast-container") || createContainer();

    const toast = document.createElement("div");
    toast.className = `toast-ios toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon-wrapper">
        <i class="fas ${getIcon(type)}"></i>
      </div>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
        if (container.children.length === 0) {
          container.remove();
        }
      }, 400);
    }, 3000);
  },
};

function createContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.style.position = "fixed";
  container.style.top = "max(env(safe-area-inset-top), 20px)";
  container.style.left = "50%";
  container.style.transform = "translateX(-50%)";
  container.style.zIndex = "10000";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "12px";
  container.style.pointerEvents = "none";
  container.style.width = "90%";
  container.style.maxWidth = "400px";
  document.body.appendChild(container);
  return container;
}

function getIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-times-circle";
    case "warning":
      return "fa-exclamation-triangle";
    default:
      return "fa-info-circle";
  }
}
