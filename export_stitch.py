import json
import pathlib
import re
import urllib.request

CONTENT_JSON = pathlib.Path(r"c:\Users\yairb\AppData\Roaming\Code\User\workspaceStorage\3d00a0e513acf7858a69f7a71976039f\GitHub.copilot-chat\chat-session-resources\a4e5cf70-ccb3-4e56-8651-f58e01b1138f\call_ur4kv7Sm4Pub2DhqwBaAIb69__vscode-1783918616142\content.json")
OUTPUT_DIR = pathlib.Path("stitch-export")
PROJECT_ID = "18157999705114764373"


def safe_filename(title: str, index: int) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9 _-]+", "_", title).strip() or f"screen-{index}"
    return f"{index:02d}_{cleaned}.html"


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    content = json.loads(CONTENT_JSON.read_text(encoding="utf-8"))
    screens = content.get("screens", [])

    links = []
    for i, screen in enumerate(screens, start=1):
        title = screen.get("title", f"screen-{i}")
        filename = safe_filename(title, i)
        html_url = screen.get("htmlCode", {}).get("downloadUrl")

        if not html_url:
            print(f"Skipping {i}: no HTML download url")
            continue

        html_bytes = urllib.request.urlopen(html_url).read()
        (OUTPUT_DIR / filename).write_bytes(html_bytes)
        links.append(f'<li><a href="{filename}">{title}</a></li>')
        print(f"Saved {filename}")

    index_html = """<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
  <title>STAGE Stitch Project</title>
</head>
<body>
  <h1>STAGE Stitch Project</h1>
  <p>Project ID: {project_id}</p>
  <ul>
    {links}
  </ul>
</body>
</html>
""".format(project_id=PROJECT_ID, links="\n    ".join(links))

    (OUTPUT_DIR / "index.html").write_text(index_html, encoding="utf-8")
    print(f"Created {OUTPUT_DIR / 'index.html'}")


if __name__ == "__main__":
    main()
