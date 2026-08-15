const FILE_PATH = "src/data/menu.json";

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token) throw new Error("GITHUB_TOKEN tanımlı değil.");
  if (!repo) throw new Error("GITHUB_REPO tanımlı değil (ör. kullanici/repo).");
  return { token, repo, branch: process.env.GITHUB_BRANCH ?? "main" };
}

async function api(path: string, init?: RequestInit) {
  const { token } = config();
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ?? response.statusText;
    throw new Error(`GitHub API hatası (${response.status}): ${message}`);
  }
  return body;
}

/** menu.json dosyasının depodaki güncel içeriğini ve sha değerini döner. */
export async function readMenuFile() {
  const { repo, branch } = config();
  const data = (await api(
    `/repos/${repo}/contents/${FILE_PATH}?ref=${encodeURIComponent(branch)}`,
  )) as { content: string; sha: string };

  return {
    sha: data.sha,
    content: Buffer.from(data.content, "base64").toString("utf8"),
  };
}

/** menu.json dosyasını commit'ler; Vercel otomatik yeni deploy başlatır. */
export async function commitMenuFile(content: string, sha: string, message: string) {
  const { repo, branch } = config();
  await api(`/repos/${repo}/contents/${FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      sha,
      branch,
    }),
  });
}
