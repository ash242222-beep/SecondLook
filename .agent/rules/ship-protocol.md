# Ship protocol (always on)
1. Work on exactly one version from PRD.md Appendix A3 at a time. Do not start the next version.
2. After finishing a version: run `npm run check`; fix failures; then run the exact `./scripts/ship.sh` line for that version from PRD.md. Never run `git push` directly.
3. Never write the Gemini API key into any file, log, or commit. It lives only in Firebase secrets or platform env settings.
4. Never add a feature that is not in the MUST or SHOULD list. If something seems missing, add it to NOTES.md and move on.
5. Product rule: no UI text, prompt, error message, or code comment may recommend, rank, or favor an option. Run the linter on all UI copy.
6. After every ship, print: version, commit hash, files changed, and what was verified.
