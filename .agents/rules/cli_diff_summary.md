# Workspace Rule: Inline Chat Code Changes Display

## MANDATORY: In-Chat Code Diffs For Every Edit
Whenever you make code changes, edit files, or create new files during a turn:

1. **Inline Code Changes Section**: You MUST include a clean `## 🛠️ Code Changes Made In This Turn` section at the end of your chat response.
2. **Per-File Breakdown**: For every single file modified or created, provide:
   - 📄 **File Path**: Clickable link to the file, e.g. [`backend/src/main.ts`](file:///Users/sorpheatepy/Library/CloudStorage/OneDrive-CambodiaAcademyofDigitalTechnology/NextGen%20Engagment/Automation_System/backend/src/main.ts)
   - 📌 **Summary**: 1 sentence explaining what changed.
   - 🔍 **Inline Diff**: A fenced ```diff code block showing the exact before/after lines added (`+`) and removed (`-`).

### Example Format:
## 🛠️ Code Changes Made In This Turn

### 📄 [`backend/src/main.ts`](file:///Users/sorpheatepy/Library/CloudStorage/OneDrive-CambodiaAcademyofDigitalTechnology/NextGen%20Engagment/Automation_System/backend/src/main.ts#L13-L20)
**Change:** Updated Helmet middleware configuration to disable CSP so Swagger UI loads without a white screen.

```diff
-  app.use(helmet());
+  app.use(
+    helmet({
+      contentSecurityPolicy: false,
+    }),
+  );
```
