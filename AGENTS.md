<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- The brand mark is a transparent extracted PNG served from a CDN `.asset.json` pointer; never wrap it in a bordered or box-shadowed tile — use a `drop-shadow` filter so the glow follows the artwork's alpha, not its bounding box.
- Every CDN asset must also be mirrored byte-for-byte at `public/__l5e/assets-v1/<asset_id>/<filename>`: the pointer's `/__l5e/...` URL only resolves on Lovable's own host, so without the mirror a clone of the repo run locally (e.g. VS Code after a Git sync) shows no logo or background. Re-copy the file after any asset re-upload, and never commit a binary that has no matching pointer.
