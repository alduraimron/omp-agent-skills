# omp-agent-skills contributor instructions

This project is independently maintained. Reused material is credited in NOTICE and UPSTREAM.json; never claim that new branding makes it original downstream work.

- Read README.md, THIRD_PARTY_NOTICES.md and MAINTENANCE.md before changing imported material.
- Preserve LICENSE and imported copyright/attribution notices. Check third-party licensing before any new copy.
- Keep new contributions outside vendor/agent-skills/ where practical. Record imported-file edits and significant modifications explicitly.
- Do not silently replace source hashes, install upstream hooks, publish, add a remote, or alter user omp settings.
- Keep `.omp-plugin/plugin.json`, the marketplace catalog and the `commands/` layout valid when changing packaging.
- Run npm run check, npm test and npm pack --dry-run --ignore-scripts before declaring work complete.
- Smoke-test plugin discovery with omp when changing manifests, skills or commands.
- Do not use the em dash character in newly written content; retain imported source bytes unchanged.
- Do not add an agent identity as a commit co-author.
