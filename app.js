/* ============================================================
   DevNav · 应用逻辑
   功能：Hash 路由 / 搜索 / 分类筛选 / 排序 / 收藏 / 历史 /
         主题切换 / 数据导出（全部本地 localStorage）
   ============================================================ */

/* ---------- 状态 ---------- */
const state = {
  page: "home",          // 当前页面
  homeCategory: "all",   // 首页快捷分类筛选
  catCategory: "all",    // 分类页选中分类
  catSort: "hot",        // 分类页排序：hot / latest / name
  search: "",            // 搜索关键字
  favorites: new Set(),  // 收藏 id 集合
  history: []            // 浏览历史 [{id, time}]
};

/* ---------- localStorage 工具 ---------- */
const LS = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }
};

/* ---------- 初始化本地数据 ---------- */
function loadLocalData() {
  state.favorites = new Set(LS.get("devnav:fav", []));
  state.history = LS.get("devnav:his", []);
  const theme = LS.get("devnav:theme", "dark");
  applyTheme(theme);
}

/* ---------- 工具查询 ---------- */
const byId = id => TOOLS.find(t => t.id === id);
const catLabel = key => (CATEGORIES.find(c => c.key === key) || {}).label || key;

/* 搜索 + 分类过滤后的工具列表 */
function filterTools(category = "all", keyword = state.search) {
  const kw = keyword.trim().toLowerCase();
  return TOOLS.filter(t => {
    if (category !== "all" && t.category !== category) return false;
    if (!kw) return true;
    const haystack = (t.name + " " + t.description + " " + t.tags.join(" ")).toLowerCase();
    return haystack.includes(kw);
  });
}

/* 排序工具列表 */
function sortTools(list, sort) {
  const arr = [...list];
  if (sort === "hot") arr.sort((a, b) => b.hot - a.hot);
  else if (sort === "latest") arr.sort((a, b) => b.date.localeCompare(a.date));
  else if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  return arr;
}

/* ---------- 安全转义 ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

/* ---------- 卡片 HTML ---------- */
function cardHTML(t) {
  const fav = state.favorites.has(t.id);
  return `
    <div class="tool-card" data-id="${t.id}" data-url="${esc(t.url)}">
      <div class="card-top">
        <span class="tool-icon">${t.icon}</span>
        <button class="fav-btn ${fav ? "active" : ""}" data-id="${t.id}" aria-label="收藏">${fav ? "❤️" : "🤍"}</button>
      </div>
      <div class="tool-name">${esc(t.name)}</div>
      <div class="tool-desc">${esc(t.description)}</div>
      <div class="tool-tags">${t.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
    </div>`;
}

/* 热门榜条目 HTML */
function hotItemHTML(t, rank) {
  const fav = state.favorites.has(t.id);
  return `
    <div class="hot-item" data-id="${t.id}" data-url="${esc(t.url)}">
      <span class="rank">${rank}</span>
      <span class="tool-icon">${t.icon}</span>
      <div class="hot-info">
        <div class="hot-name">${esc(t.name)}</div>
        <div class="hot-desc">${esc(t.description)}</div>
      </div>
      <span class="hot-badge">🔥 ${t.hot}</span>
      <button class="fav-btn ${fav ? "active" : ""}" data-id="${t.id}" aria-label="收藏">${fav ? "❤️" : "🤍"}</button>
    </div>`;
}

/* ---------- 首页渲染 ---------- */
function renderHome() {
  const list = filterTools(state.homeCategory);

  // 快捷分类标签
  document.getElementById("home-tags").innerHTML = CATEGORIES.map(c =>
    `<button class="chip ${state.homeCategory === c.key ? "active" : ""}" data-cat="${c.key}">${c.icon} ${c.label}</button>`
  ).join("");

  // 精选推荐
  const featured = list.filter(t => t.featured);
  document.getElementById("home-featured").innerHTML =
    featured.length
      ? featured.map(cardHTML).join("")
      : `<div class="mine-empty" style="grid-column:1/-1"><span class="big">🔍</span>没有匹配的精选工具</div>`;

  // 热门工具榜 TOP10
  const hot = sortTools(list, "hot").slice(0, 10);
  document.getElementById("home-hot").innerHTML =
    hot.length
      ? hot.map((t, i) => hotItemHTML(t, i + 1)).join("")
      : `<div class="mine-empty"><span class="big">🔍</span>没有匹配的工具</div>`;

  // 最新收录 TOP8
  const latest = sortTools(list, "latest").slice(0, 8);
  document.getElementById("home-latest").innerHTML =
    latest.length
      ? latest.map(cardHTML).join("")
      : `<div class="mine-empty" style="grid-column:1/-1"><span class="big">🔍</span>没有匹配的工具</div>`;
}

/* ---------- 分类页渲染 ---------- */
function renderCategoryNav() {
  const chipHTML = c =>
    `<button class="chip ${state.catCategory === c.key ? "active" : ""}" data-cat="${c.key}">${c.icon} ${c.label}</button>`;

  document.getElementById("cat-sidebar").innerHTML = CATEGORIES.map(chipHTML).join("");
  document.getElementById("cat-tabs").innerHTML = CATEGORIES.map(chipHTML).join("");

  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.sort === state.catSort);
  });
}

function renderCategoryGrid() {
  const list = sortTools(filterTools(state.catCategory), state.catSort);
  document.getElementById("cat-count").textContent = `共 ${list.length} 个工具`;
  document.getElementById("cat-grid").innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<div class="mine-empty" style="grid-column:1/-1"><span class="big">🔍</span>该分类暂无工具</div>`;
}

/* ---------- 我的页渲染 ---------- */
function renderMine() {
  // 收藏
  const favs = TOOLS.filter(t => state.favorites.has(t.id));
  document.getElementById("fav-count").textContent = favs.length ? `${favs.length} 个` : "";
  document.getElementById("mine-fav").innerHTML = favs.map(cardHTML).join("");
  document.getElementById("fav-empty").style.display = favs.length ? "none" : "block";

  // 历史
  const his = state.history.map(h => byId(h.id)).filter(Boolean);
  document.getElementById("his-count").textContent = his.length ? `${his.length} 条` : "";
  document.getElementById("mine-history").innerHTML = his.map((t, i) => hotItemHTML(t, i + 1)).join("");
  document.getElementById("his-empty").style.display = his.length ? "none" : "block";
}

/* ---------- 主题 ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const sw = document.getElementById("theme-switch");
  if (sw) sw.classList.toggle("on", theme === "dark");
  LS.set("devnav:theme", theme);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(cur);
}

/* ---------- 收藏 ---------- */
function toggleFav(id, btn) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  LS.set("devnav:fav", [...state.favorites]);

  // 更新按钮视觉 + 缩放反馈
  const isFav = state.favorites.has(id);
  btn.classList.toggle("active", isFav);
  btn.textContent = isFav ? "❤️" : "🤍";
  btn.classList.remove("pop");
  void btn.offsetWidth; // 重绘以重新触发动画
  btn.classList.add("pop");

  // 若当前在我的页，实时刷新收藏区
  if (state.page === "mine") renderMine();
}

/* ---------- 历史 ---------- */
function recordHistory(id) {
  state.history = [{ id, time: Date.now() }, ...state.history.filter(h => h.id !== id)].slice(0, 30);
  LS.set("devnav:his", state.history);
  if (state.page === "mine") renderMine();
}

/* ---------- 打开工具 ---------- */
function openTool(id) {
  const t = byId(id);
  if (!t) return;
  recordHistory(id);
  window.open(t.url, "_blank", "noopener");
}

/* ---------- 路由与页面切换 ---------- */
function showPage(name) {
  state.page = name;

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById("page-" + name);
  if (page) {
    page.classList.add("active");
    // 重新触发淡入动画
    page.style.animation = "none";
    void page.offsetWidth;
    page.style.animation = "";
  }

  document.querySelectorAll(".nav-item").forEach(n =>
    n.classList.toggle("active", n.dataset.page === name)
  );

  // 进入页面时渲染
  if (name === "home") renderHome();
  else if (name === "category") { renderCategoryNav(); renderCategoryGrid(); }
  else if (name === "mine") renderMine();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleHash() {
  const route = (location.hash || "#/home").replace("#/", "");
  const valid = ["home", "category", "mine"];
  showPage(valid.includes(route) ? route : "home");
}

/* ---------- 事件委托：卡片点击 / 收藏 ---------- */
function setupDelegation() {
  document.getElementById("app").addEventListener("click", e => {
    const favBtn = e.target.closest(".fav-btn");
    if (favBtn) {
      e.stopPropagation();
      toggleFav(favBtn.dataset.id, favBtn);
      return;
    }
    const card = e.target.closest("[data-id][data-url]");
    if (card) openTool(card.dataset.id);
  });
}

/* ---------- 事件绑定 ---------- */
function setupEvents() {
  // 搜索（防抖 + 平滑过渡）
  const searchInput = document.getElementById("home-search");
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.search = searchInput.value;
      renderHome();
    }, 160);
  });

  // 首页分类标签
  document.getElementById("home-tags").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.homeCategory = chip.dataset.cat;
    renderHome();
  });

  // 分类页分类（侧栏 + 顶部标签）
  document.getElementById("cat-sidebar").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.catCategory = chip.dataset.cat;
    renderCategoryNav();
    renderCategoryGrid();
  });
  document.getElementById("cat-tabs").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.catCategory = chip.dataset.cat;
    renderCategoryNav();
    renderCategoryGrid();
  });

  // 分类排序
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.catSort = btn.dataset.sort;
      renderCategoryNav();
      renderCategoryGrid();
    });
  });

  // 主题切换
  document.getElementById("theme-switch").addEventListener("click", toggleTheme);

  // 数据导出
  document.getElementById("export-btn").addEventListener("click", exportData);

  // 清除数据
  document.getElementById("clear-btn").addEventListener("click", clearData);

  // 底部导航
  document.querySelectorAll(".nav-item").forEach(n => {
    n.addEventListener("click", () => {
      // 交给 hashchange 处理，保证路由一致
      location.hash = "#/" + n.dataset.page;
    });
  });
}

/* ---------- 数据导出 / 清除 ---------- */
function exportData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    favorites: TOOLS.filter(t => state.favorites.has(t.id)).map(t => t.id),
    history: state.history,
    theme: document.documentElement.getAttribute("data-theme")
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "devnav-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

function clearData() {
  if (!confirm("确定要清空收藏与浏览历史吗？此操作不可撤销。")) return;
  state.favorites.clear();
  state.history = [];
  LS.remove("devnav:fav");
  LS.remove("devnav:his");
  renderMine();
}

/* ---------- 启动 ---------- */
function init() {
  loadLocalData();
  setupDelegation();
  setupEvents();
  window.addEventListener("hashchange", handleHash);
  handleHash();
}

document.addEventListener("DOMContentLoaded", init);
