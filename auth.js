/* ============================================================
   DevNav · 登录模块（GitHub / Google）
   ------------------------------------------------------------
   使用说明：
   1. 默认「演示模式」：无需任何配置，点击按钮即可模拟登录，
      登录态保存在 localStorage，可正常退出。
   2. 接入真实登录：在下方 AUTH_CONFIG 填入对应凭据即可。
      - Google 支持纯前端 implicit 流程，填 clientId 即真实可用。
      - GitHub 官方 OAuth 必须持有 client_secret，纯静态页面无法
        安全完成 token 交换，因此需搭配一个后端代理接口
        （如 Netlify Function / Cloudflare Worker），由代理保管
        secret 并用 code 换取 access_token，再返回用户信息 JSON。
   ============================================================ */

const AUTH_CONFIG = {
  github: {
    clientId: "",      // GitHub OAuth App 的 Client ID
    proxyUrl: ""       // 后端代理接口，如 https://xxx.netlify.app/api/github-auth
  },
  google: {
    clientId: ""       // Google OAuth Client ID（Web 应用，类型选 Web）
  }
};

/* ---------- 登录状态 ---------- */
let auth = {
  loggedIn: false,
  provider: null,   // "github" | "google"
  demo: false,      // 是否为演示登录
  user: null        // { name, email, login, avatar }
};

const AUTH_KEY = "devnav:auth";

/* ---------- 本地存储 ---------- */
function authLoad() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) auth = JSON.parse(raw);
  } catch (e) {}
}
function authSave() {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); } catch (e) {}
}

/* ---------- 品牌图标 SVG ---------- */
const GITHUB_SVG = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`;

const GOOGLE_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.46 1.8 14.96.8 12 .8 7.32.8 3.32 3.48 1.44 7.4l3.72 2.88C6.04 7.44 8.76 5.04 12 5.04z"/><path fill="#4285F4" d="M23.52 12.2c0-.82-.08-1.42-.2-2.04H12v3.86h6.48c-.12 1-.84 2.5-2.4 3.5l3.68 2.84c2.2-2.02 3.76-5 3.76-8.16z"/><path fill="#FBBC05" d="M5.16 14.32c-.28-.84-.44-1.72-.44-2.62s.16-1.78.44-2.62L1.44 6.2C.56 7.96 0 9.92 0 12s.56 4.04 1.44 5.8l3.72-3.48z"/><path fill="#34A853" d="M12 23.2c3.04 0 5.6-1 7.48-2.72l-3.68-2.84c-1 .7-2.34 1.18-3.8 1.18-3.24 0-5.96-2.16-6.96-5.16L1.44 16.6C3.32 20.52 7.32 23.2 12 23.2z"/></svg>`;

/* ---------- 头像（无图片时用首字母） ---------- */
function avatarHTML(user) {
  if (user && user.avatar) {
    return `<div class="auth-avatar"><img src="${user.avatar}" alt="avatar" referrerpolicy="no-referrer"></div>`;
  }
  const ch = (user && user.name ? user.name : "U").trim().charAt(0).toUpperCase();
  return `<div class="auth-avatar letter">${ch}</div>`;
}

/* ---------- 渲染登录区 ---------- */
function renderAuth() {
  const el = document.getElementById("auth-section");
  if (!el) return;
  const provider = document.getElementById("auth-provider");

  if (auth.loggedIn && auth.user) {
    const badge = auth.demo ? "演示账号" : (auth.provider === "github" ? "GitHub" : "Google");
    if (provider) provider.textContent = badge;
    el.innerHTML = `
      <div class="auth-card">
        <div class="auth-user">
          ${avatarHTML(auth.user)}
          <div class="auth-user-info">
            <div class="auth-user-name">${esc(auth.user.name || "用户")}</div>
            <div class="auth-user-email">${esc(auth.user.email || auth.user.login || "")}</div>
            <span class="provider-badge">${badge}</span>
          </div>
        </div>
        <div class="auth-actions">
          <button class="action-btn" data-logout>退出登录</button>
        </div>
      </div>`;
  } else {
    if (provider) provider.textContent = "";
    el.innerHTML = `
      <div class="auth-card">
        <div class="auth-avatar">👤</div>
        <div class="auth-title">登录 DevNav</div>
        <div class="auth-desc">登录后可跨设备同步收藏与浏览历史</div>
        <div class="oauth-list">
          <button class="oauth-btn github" data-login="github">${GITHUB_SVG} 使用 GitHub 登录</button>
          <button class="oauth-btn google" data-login="google">${GOOGLE_SVG} 使用 Google 登录</button>
        </div>
      </div>`;
  }
}

/* ---------- 退出 ---------- */
function authLogout() {
  auth = { loggedIn: false, provider: null, demo: false, user: null };
  authSave();
  renderAuth();
}

/* ---------- 演示登录 ---------- */
function demoLogin(provider) {
  const user = provider === "github"
    ? { name: "GitHub 用户", login: "@github-user", email: "github-user@users.noreply.github.com", avatar: "" }
    : { name: "Google 用户", login: null, email: "google-user@gmail.com", avatar: "" };
  auth = { loggedIn: true, provider, demo: true, user };
  authSave();
  renderAuth();
}

/* ============================================================
   真实 OAuth 流程（填入 AUTH_CONFIG 后自动启用）
   ============================================================ */

/* Google：implicit 流程，纯前端即可完成 */
function googleLogin() {
  const cfg = AUTH_CONFIG.google;
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: location.origin + location.pathname,
    response_type: "token",
    scope: "openid email profile",
    prompt: "select_account",
    include_granted_scopes: "true"
  });
  location.href = "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
}

async function googleCallback() {
  if (!location.hash.includes("access_token")) return;
  const params = new URLSearchParams(location.hash.slice(1));
  const token = params.get("access_token");
  if (!token) return;
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: "Bearer " + token }
    });
    const u = await res.json();
    auth = {
      loggedIn: true, provider: "google", demo: false,
      user: { name: u.name, email: u.email, avatar: u.picture, login: null }
    };
    authSave();
    renderAuth();
  } catch (e) {
    console.warn("Google 登录失败", e);
  }
  history.replaceState(null, "", location.pathname + location.search);
  location.hash = "#/mine";
}

/* GitHub：code 流程，token 交换交给后端代理完成 */
function githubLogin() {
  const cfg = AUTH_CONFIG.github;
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: location.origin + location.pathname,
    scope: "read:user user:email",
    state: "devnav"
  });
  location.href = "https://github.com/login/oauth/authorize?" + params.toString();
}

async function githubCallback() {
  const code = new URLSearchParams(location.search).get("code");
  if (!code) return;
  try {
    // 代理接口约定：GET proxyUrl?code=xxx 返回用户 JSON { name, login, email, avatar }
    const res = await fetch(AUTH_CONFIG.github.proxyUrl + "?code=" + encodeURIComponent(code));
    const u = await res.json();
    auth = {
      loggedIn: true, provider: "github", demo: false,
      user: { name: u.name || u.login, login: "@" + (u.login || ""), email: u.email || "", avatar: u.avatar || "" }
    };
    authSave();
    renderAuth();
  } catch (e) {
    console.warn("GitHub 登录失败", e);
  }
  history.replaceState(null, "", location.pathname + location.hash);
  location.hash = "#/mine";
}

/* ---------- 登录入口 ---------- */
function loginWith(provider) {
  if (provider === "google" && AUTH_CONFIG.google.clientId) return googleLogin();
  if (provider === "github" && AUTH_CONFIG.github.clientId && AUTH_CONFIG.github.proxyUrl) return githubLogin();
  demoLogin(provider); // 未配置凭据时进入演示模式
}

/* ---------- 事件绑定 ---------- */
function bindAuthEvents() {
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-login]");
    if (btn) { loginWith(btn.dataset.login); return; }
    if (e.target.closest("[data-logout]")) authLogout();
  });
}

/* ---------- 启动 ---------- */
function initAuth() {
  authLoad();
  bindAuthEvents();
  renderAuth();
  // 处理 OAuth 回调（真实登录场景）
  googleCallback();
  githubCallback();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}