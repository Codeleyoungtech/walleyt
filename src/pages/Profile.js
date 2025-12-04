import { state } from "../state.js";
import { PageHeader } from "../components/PageHeader.js";
import { Toast } from "../components/Toast.js";
import { Modal } from "../components/Modal.js";
import { router } from "../router.js";

export function Profile() {
  const container = document.createElement("div");
  container.className = "page profile-page";
  container.style.paddingBottom = "80px";

  // Header
  container.appendChild(PageHeader("Profile"));

  // Content
  const content = document.createElement("div");
  content.style.padding = "1.5rem 1.25rem";

  // Profile Info with safe access
  const profileName = state.profile?.name || "Eleazar";
  const profileBio = state.profile?.bio || "Wallpaper Enthusiast";

  content.innerHTML = `
    <div class="profile-header" style="text-align: center; margin-bottom: 2rem;">
      <div class="profile-avatar" style="width: 100px; height: 100px; margin: 0 auto 1rem; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: white; font-weight: 700;">
        ${profileName.charAt(0).toUpperCase()}
      </div>
      <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${profileName}</h2>
      <p style="color: var(--text-secondary);">${profileBio}</p>
    </div>

    <div class="profile-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
      <div class="stat-box" style="text-align: center; padding: 1rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border);">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.25rem;">${
          state.walle.size
        }</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Walle</div>
      </div>
      <div class="stat-box" style="text-align: center; padding: 1rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border);">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.25rem;">${
          state.downloads.size
        }</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Downloads</div>
      </div>
      <div class="stat-box" style="text-align: center; padding: 1rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border);">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.25rem;">${
          state.wallpapers.length
        }</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Total</div>
      </div>
    </div>

    <div class="profile-menu">
      <!-- Theme Toggle -->
      <div class="menu-item" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="menu-icon" style="width: 40px; height: 40px; border-radius: 10px; background: var(--surface-light); display: flex; align-items: center; justify-content: center; color: var(--primary);">
            <i class="fas fa-moon"></i>
          </div>
          <div class="menu-text">
            <div class="menu-title" style="font-weight: 600;">Dark Mode</div>
          </div>
        </div>
        <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
          <input type="checkbox" id="theme-toggle" ${
            state.theme === "dark" ? "checked" : ""
          }>
          <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
        </label>
      </div>

      ${renderMenuItem(
        "edit-profile",
        "fa-user-edit",
        "Edit Profile",
        "Update your information"
      )}
      ${renderMenuItem(
        "about",
        "fa-info-circle",
        "About Walleyt",
        "Version 1.0.0"
      )}
    </div>
  `;

  // Event Listeners
  const themeToggle = content.querySelector("#theme-toggle");
  themeToggle.addEventListener("change", (e) => {
    state.toggleTheme();
    Toast.show(
      `Switched to ${state.theme === "dark" ? "Dark" : "Light"} Mode`,
      "success"
    );
  });

  // Add click handlers for menu items
  content.querySelector('[data-action="edit-profile"]').onclick = () =>
    showEditProfileModal();
  content.querySelector('[data-action="about"]').onclick = () =>
    Toast.show("Walleyt v1.0.0 by CEYT(Codeleyoungtech)", "info");

  container.appendChild(content);

  // Add Switch CSS
  const style = document.createElement("style");
  style.textContent = `
    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: var(--primary);
    }
    input:checked + .slider:before {
      transform: translateX(22px);
    }
  `;
  container.appendChild(style);

  return container;
}

function renderMenuItem(action, icon, title, subtitle) {
  return `
    <div class="menu-item" data-action="${action}" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 0.75rem; cursor: pointer; transition: var(--transition);">
      <div class="menu-icon" style="width: 40px; height: 40px; border-radius: 10px; background: var(--surface-light); display: flex; align-items: center; justify-content: center; color: var(--primary);">
        <i class="fas ${icon}"></i>
      </div>
      <div class="menu-text" style="flex: 1;">
        <div class="menu-title" style="font-weight: 600; margin-bottom: 0.125rem;">${title}</div>
        <div class="menu-subtitle" style="font-size: 0.8125rem; color: var(--text-secondary);">${subtitle}</div>
      </div>
      <i class="fas fa-chevron-right menu-arrow" style="color: var(--text-secondary);"></i>
    </div>
  `;
}

function showEditProfileModal() {
  const profileName = state.profile?.name || "Eleazar";

  Modal.show({
    title: "Edit Profile",
    content: `
      <label style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Display Name</label>
      <input type="text" class="modal-input" id="profile-name-input" value="${profileName}" placeholder="Enter your name">
      
      <label style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; margin-top: 1rem; display: block;">Bio</label>
      <input type="text" class="modal-input" id="profile-bio-input" value="${
        state.profile?.bio || ""
      }" placeholder="Enter your bio">
    `,
    confirmText: "Save Changes",
    onConfirm: () => {
      const nameInput = document.getElementById("profile-name-input");
      const bioInput = document.getElementById("profile-bio-input");
      const name = nameInput.value.trim();
      const bio = bioInput.value.trim();

      if (name) {
        state.updateProfile({ name, bio: bio || "Wallpaper Enthusiast" });
        Toast.show("Profile updated!", "success");
        router.navigate("profile");
        return true;
      }
      Toast.show("Name cannot be empty", "error");
      return false;
    },
  });
}
