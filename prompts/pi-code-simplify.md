---
description: Simplify approved code without changing behavior using pi-agent-skills.
argument-hint: "[approved simplification scope]"
---
Read the `pi-agent-workflow` skill at its advertised path. Then read the `code-simplification` skill and follow it with the available Pi capabilities.

Preserve behavior and existing tests. Limit changes to the approved scope and separate refactoring from new features. If the user requested review only, report opportunities without editing.

User request: $ARGUMENTS
