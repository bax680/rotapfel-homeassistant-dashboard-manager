"""Dependency-free static checks; does not import Home Assistant."""
import ast
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "custom_components" / "rotapfel_dashboard_manager"

def main():
    for path in sorted(BASE.rglob("*.py")):
        ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
        print(f"Python syntax OK: {path.relative_to(ROOT)}")
    manifest = json.loads((BASE / "manifest.json").read_text(encoding="utf-8"))
    version = manifest["version"]
    backend = ast.parse((BASE / "__init__.py").read_text(encoding="utf-8"))
    versions = [
        ast.literal_eval(node.value)
        for node in backend.body
        if isinstance(node, ast.Assign)
        and any(isinstance(t, ast.Name) and t.id == "VERSION" for t in node.targets)
    ]
    frontend = (BASE / "frontend" / "rotapfel-manager.js").read_text(encoding="utf-8")
    match = re.search(r"const ROTAPFEL_FRONTEND_VERSION\s*=\s*['\"]([^'\"]+)['\"]", frontend)
    if versions != [version] or not match or match.group(1) != version:
        raise SystemExit(f"Version mismatch: manifest={version}, backend={versions}, frontend={match.group(1) if match else None}")
    alpha = re.search(r"const ROTAPFEL_FRONTEND_ALPHA\s*=\s*['\"]([^'\"]+)['\"]", frontend)
    if "a" in version and (not alpha or version.split("a", 1)[1] != alpha.group(1).replace(".", "")):
        raise SystemExit("Alpha label does not match integration version")
    print(f"Version consistency OK: {version}")

if __name__ == "__main__":
    main()
