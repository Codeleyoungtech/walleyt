export function PageHeader(title, actions = []) {
  const header = document.createElement("div");
  header.className = "page-header";

  // iOS-inspired design: smaller, more elegant
  header.style.cssText = `
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--background);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(var(--background-rgb), 0.8);
    border-bottom: 0.5px solid var(--border);
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: var(--transition);
  `;

  // Title
  const titleEl = document.createElement("h1");
  titleEl.textContent = title;
  titleEl.style.cssText = `
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
  `;

  // Actions container
  const actionsContainer = document.createElement("div");
  actionsContainer.style.cssText = `
    display: flex;
    gap: 0.5rem;
    align-items: center;
  `;

  // Create action buttons
  actions.forEach((action) => {
    const btn = document.createElement("button");
    btn.className = "header-action-btn";
    btn.innerHTML = `<i class="fas ${action.icon}"></i>`;
    btn.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    `;

    btn.onmouseenter = () => {
      btn.style.background = "var(--surface-light)";
      btn.style.transform = "scale(1.05)";
    };

    btn.onmouseleave = () => {
      btn.style.background = "var(--surface)";
      btn.style.transform = "scale(1)";
    };

    btn.onclick = action.onClick;
    actionsContainer.appendChild(btn);
  });

  header.appendChild(titleEl);
  if (actions.length > 0) {
    header.appendChild(actionsContainer);
  }

  return header;
}
