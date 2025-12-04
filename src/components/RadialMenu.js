export const RadialMenu = {
  show({ x, y, options, onSelect }) {
    const existingMenu = document.querySelector(".radial-menu-overlay");
    if (existingMenu) existingMenu.remove();

    const overlay = document.createElement("div");
    overlay.className = "radial-menu-overlay";

    // Create menu container centered at touch point
    const menu = document.createElement("div");
    menu.className = "radial-menu";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    // Create options with improved animations
    options.forEach((opt, index) => {
      const item = document.createElement("div");
      item.className = `radial-item ${opt.id}-opt`;
      item.innerHTML = `<i class="fas ${opt.icon}"></i>`;
      item.dataset.id = opt.id;
      // Stagger animation delay for smoother appearance
      item.style.animationDelay = `${index * 30}ms`;
      menu.appendChild(item);
    });

    overlay.appendChild(menu);
    document.body.appendChild(overlay);

    // Smooth animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add("show");
        menu.classList.add("show");
      });
    });

    // Touch handling for selection with improved feedback
    let activeItem = null;

    const handleMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const item = target?.closest(".radial-item");

      if (item && item !== activeItem) {
        // Remove active from previous
        if (activeItem) activeItem.classList.remove("active");

        // Add active to new item
        activeItem = item;
        activeItem.classList.add("active");

        // Stronger haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);
      } else if (!item && activeItem) {
        activeItem.classList.remove("active");
        activeItem = null;
      }
    };

    const handleEnd = (e) => {
      e.preventDefault();

      if (activeItem) {
        const id = activeItem.dataset.id;

        // Visual confirmation before closing
        activeItem.style.transform = activeItem.style.transform.replace(
          "scale(1.3)",
          "scale(1.5)"
        );

        // Stronger success haptic
        if (navigator.vibrate) navigator.vibrate(25);

        setTimeout(() => {
          onSelect(id);
          close();
        }, 100);
      } else {
        close();
      }
    };

    const close = () => {
      overlay.classList.remove("show");
      menu.classList.remove("show");
      setTimeout(() => {
        overlay.remove();
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      }, 250);
    };

    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);

    // Auto-close after 5 seconds if no interaction
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        close();
      }
    }, 5000);
  },
};
