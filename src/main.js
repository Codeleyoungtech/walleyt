import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");
  const closeModal = document.getElementById("closeModal");

  // Fetch Wallpapers
  fetch("wallpapers.json")
    .then((response) => response.json())
    .then((data) => {
      renderGallery(data);
    })
    .catch((error) => console.error("Error fetching wallpapers:", error));

  function renderGallery(wallpapers) {
    // Clear existing content (if any)
    gallery.innerHTML = "";

    wallpapers.forEach((wallpaper) => {
      const card = document.createElement("div");
      card.className = "wallpaper-card";
      card.onclick = () => openModal(wallpaper);

      // Skeleton Loading
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton";
      card.appendChild(skeleton);

      const img = document.createElement("img");
      img.dataset.src = wallpaper.filename; // Use data-src for lazy loading
      img.alt = wallpaper.title;
      img.style.display = "none"; // Hide initially

      // Lazy Loading Observer
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.onload = () => {
              image.style.display = "block";
              skeleton.remove(); // Remove skeleton when loaded
            };
            observer.unobserve(image);
          }
        });
      });
      observer.observe(img);

      const overlay = document.createElement("div");
      overlay.className = "card-overlay";
      overlay.innerHTML = `<h3>${wallpaper.title}</h3><p>${wallpaper.category}</p>`;

      card.appendChild(img);
      card.appendChild(overlay);
      gallery.appendChild(card);
    });
  }

  // Modal Functions
  function openModal(wallpaper) {
    modalImage.src = wallpaper.filename;
    modalTitle.textContent = wallpaper.title;
    modalDesc.textContent = wallpaper.description;
    downloadBtn.href = wallpaper.filename;

    modal.classList.add("active");
  }

  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // Share Functionality
  shareBtn.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: modalTitle.textContent,
          text: modalDesc.textContent,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Web Share API not supported in this browser.");
    }
  });
});
