/**
 * Complete API smoke test for Project S7
 * Usage:
 *   node scripts/smoke-test.mjs
 *   API_URL=https://your-api.up.railway.app/api node scripts/smoke-test.mjs
 */
const API =
  process.env.API_URL ||
  "https://ingenious-dedication-production-33cb.up.railway.app/api";
const EMAIL = process.env.ADMIN_EMAIL || "admin@projects7.com";
const PASSWORD = process.env.ADMIN_PASSWORD || "Admin@S7Secure2026";

const results = [];
let token = "";
let portfolioId = "";
let portfolioSlug = "";

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function req(method, path, { body, auth = false, formData = false } = {}) {
  const headers = {};
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  if (body && !formData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body
      ? formData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { res, json, status: res.status };
}

async function main() {
  console.log(`\n🔥 Project S7 API smoke test`);
  console.log(`   API: ${API}\n`);

  // 1. Health
  {
    const { status, json } = await req("GET", "/health");
    if (status === 200 && json?.success) {
      pass("GET /health", `db=${json.database || "?"} hasAdmin=${json.hasAdmin}`);
    } else {
      fail("GET /health", `status=${status} ${json?.message || ""}`);
    }
  }

  // 2. API catalog
  {
    const { status, json } = await req("GET", "/");
    if (status === 200 && json?.endpoints) pass("GET /api catalog");
    else fail("GET /api catalog", `status=${status}`);
  }

  // 3. Public lists
  for (const path of [
    "/services",
    "/portfolio",
    "/portfolio?all=true",
    "/content/testimonials",
    "/content/faqs",
    "/content/industries",
    "/content/settings",
    "/jobs",
  ]) {
    const { status, json } = await req("GET", path);
    if (status === 200 && json?.success !== false) {
      const n = Array.isArray(json?.data)
        ? json.data.length
        : json?.data
          ? "object"
          : "?";
      pass(`GET ${path}`, `items=${n}`);
    } else {
      fail(`GET ${path}`, `status=${status} ${json?.message || ""}`);
    }
  }

  // 4. Login (wrong password)
  {
    const { status } = await req("POST", "/auth/login", {
      body: { email: EMAIL, password: "wrong-password-xxx" },
    });
    if (status === 401) pass("POST /auth/login rejects bad password");
    else fail("POST /auth/login rejects bad password", `status=${status}`);
  }

  // 5. Login success
  {
    const { status, json } = await req("POST", "/auth/login", {
      body: { email: EMAIL, password: PASSWORD },
    });
    if (status === 200 && json?.token) {
      token = json.token;
      pass("POST /auth/login", `admin=${json.admin?.email}`);
    } else {
      fail(
        "POST /auth/login",
        `status=${status} ${json?.message || ""} (set ADMIN_EMAIL/PASSWORD if needed)`
      );
      console.log("\n⛔ Cannot continue admin tests without token.\n");
      return printSummary();
    }
  }

  // 6. Auth me
  {
    const { status, json } = await req("GET", "/auth/me", { auth: true });
    if (status === 200 && json?.admin?.email) pass("GET /auth/me", json.admin.email);
    else fail("GET /auth/me", `status=${status}`);
  }

  // 7. Dashboard
  {
    const { status, json } = await req("GET", "/content/dashboard", { auth: true });
    if (status === 200 && json?.data?.stats) {
      pass("GET /content/dashboard", JSON.stringify(json.data.stats));
    } else fail("GET /content/dashboard", `status=${status}`);
  }

  // 8. Portfolio CREATE
  const slug = `smoke-test-${Date.now()}`;
  {
    const { status, json } = await req("POST", "/portfolio", {
      auth: true,
      body: {
        title: "Smoke Test Project",
        slug,
        category: "Exhibitions",
        client: "QA",
        location: "Test City",
        year: "2026",
        description: "Created by automated smoke test — safe to delete.",
        coverImage:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        tags: ["smoke", "test"],
        gallery: [],
        featured: false,
        published: true,
        order: 999,
      },
    });
    if (status === 201 && json?.data?.id) {
      portfolioId = json.data.id;
      portfolioSlug = json.data.slug;
      pass("POST /portfolio (create)", portfolioId);
    } else {
      fail("POST /portfolio (create)", `status=${status} ${json?.message || ""}`);
    }
  }

  // 9. Portfolio GET by slug
  if (portfolioSlug) {
    const { status, json } = await req("GET", `/portfolio/${portfolioSlug}`);
    if (status === 200 && json?.data?.slug === portfolioSlug) {
      pass("GET /portfolio/:slug");
    } else fail("GET /portfolio/:slug", `status=${status}`);
  }

  // 10. Portfolio EDIT
  if (portfolioId) {
    const { status, json } = await req("PUT", `/portfolio/${portfolioId}`, {
      auth: true,
      body: {
        title: "Smoke Test Project (Edited)",
        description: "Updated by smoke test.",
      },
    });
    if (status === 200 && json?.data?.title?.includes("Edited")) {
      pass("PUT /portfolio/:id (edit)");
    } else fail("PUT /portfolio/:id (edit)", `status=${status} ${json?.message || ""}`);
  }

  // 11. Portfolio ON/OFF (publish toggle)
  if (portfolioId) {
    const off = await req("PUT", `/portfolio/${portfolioId}`, {
      auth: true,
      body: { published: false },
    });
    if (off.status === 200 && off.json?.data?.published === false) {
      pass("PUT /portfolio published=false (OFF)");
    } else {
      fail("PUT /portfolio published=false (OFF)", `status=${off.status}`);
    }

    // public list should not include unpublished
    const publicList = await req("GET", "/portfolio");
    const foundPublic = (publicList.json?.data || []).some((p) => p.id === portfolioId);
    if (!foundPublic) pass("Unpublished item hidden from public list");
    else fail("Unpublished item hidden from public list", "still visible");

    // all=true with auth path still lists (public endpoint all)
    const allList = await req("GET", "/portfolio?all=true");
    const foundAll = (allList.json?.data || []).some((p) => p.id === portfolioId);
    if (foundAll) pass("GET /portfolio?all=true shows unpublished");
    else fail("GET /portfolio?all=true shows unpublished");

    const on = await req("PATCH", `/portfolio/${portfolioId}/publish`, {
      auth: true,
      body: { published: true },
    });
    if (on.status === 200 && on.json?.data?.published === true) {
      pass("PATCH /portfolio/:id/publish (ON)");
    } else {
      // fallback PUT if patch not deployed yet
      const on2 = await req("PUT", `/portfolio/${portfolioId}`, {
        auth: true,
        body: { published: true },
      });
      if (on2.status === 200 && on2.json?.data?.published === true) {
        pass("PATCH publish fallback via PUT (ON)");
      } else {
        fail("PATCH /portfolio/:id/publish (ON)", `status=${on.status}`);
      }
    }
  }

  // 12. Contact message
  {
    const { status, json } = await req("POST", "/messages", {
      body: {
        name: "Smoke Tester",
        email: "smoke@example.com",
        subject: "Smoke test",
        message: "Automated smoke test message — ignore.",
      },
    });
    if (status === 201 && json?.success) pass("POST /messages");
    else fail("POST /messages", `status=${status} ${json?.message || ""}`);
  }

  // 13. Quote
  {
    const { status, json } = await req("POST", "/quotes", {
      body: {
        company: "Smoke Co",
        name: "Smoke Tester",
        email: "smoke@example.com",
        phone: "+10000000000",
        service: "Exhibition Management",
        message: "Automated smoke quote — ignore.",
      },
    });
    if (status === 201 && json?.success) pass("POST /quotes");
    else fail("POST /quotes", `status=${status} ${json?.message || ""}`);
  }

  // 14. Admin quotes / messages list
  {
    const q = await req("GET", "/quotes", { auth: true });
    if (q.status === 200) pass("GET /quotes (admin)");
    else fail("GET /quotes (admin)", `status=${q.status}`);
  }
  {
    const m = await req("GET", "/messages", { auth: true });
    if (m.status === 200) pass("GET /messages (admin)");
    else fail("GET /messages (admin)", `status=${m.status}`);
  }

  // 15. FAQ admin list
  {
    const { status } = await req("GET", "/content/faqs?all=true", { auth: true });
    if (status === 200) pass("GET /content/faqs?all=true");
    else fail("GET /content/faqs?all=true", `status=${status}`);
  }

  // 16. Unauthorized create
  {
    const prev = token;
    token = "";
    const { status } = await req("POST", "/portfolio", {
      auth: true,
      body: { title: "x", slug: "x", category: "Events", description: "d", coverImage: "http://x" },
    });
    token = prev;
    if (status === 401) pass("POST /portfolio without auth → 401");
    else fail("POST /portfolio without auth → 401", `status=${status}`);
  }

  // 17. Cleanup delete
  if (portfolioId) {
    const { status } = await req("DELETE", `/portfolio/${portfolioId}`, { auth: true });
    if (status === 200) pass("DELETE /portfolio/:id (cleanup)");
    else fail("DELETE /portfolio/:id (cleanup)", `status=${status}`);
  }

  // 18. Logout
  {
    const { status } = await req("POST", "/auth/logout", { auth: true });
    if (status === 200) pass("POST /auth/logout");
    else fail("POST /auth/logout", `status=${status}`);
  }

  printSummary();
}

function printSummary() {
  const ok = results.filter((r) => r.ok).length;
  const bad = results.filter((r) => !r.ok).length;
  console.log(`\n────────────────────────────`);
  console.log(`  Passed: ${ok}`);
  console.log(`  Failed: ${bad}`);
  console.log(`  Total:  ${results.length}`);
  console.log(`────────────────────────────\n`);
  if (bad > 0) {
    console.log("Failed checks:");
    results.filter((r) => !r.ok).forEach((r) => console.log(`  - ${r.name}: ${r.detail}`));
    process.exit(1);
  }
  console.log("All smoke tests passed.\n");
}

main().catch((e) => {
  console.error("Smoke test crashed:", e);
  process.exit(1);
});
