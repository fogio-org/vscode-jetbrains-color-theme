# Change Log

## 1.0.3

- Add structured CI workflow with manifest validation, theme validation, VSIX smoke test, PR status comments, and auto-approval on success
- Add release workflow notifications for GitHub and Telegram with publish logs for VS Code Marketplace and Open VSX
- Add dedicated manifest validation for theme extension metadata, icons, and declared theme files

## 1.0.2

- Update readme badges

## 1.0.1

- Bump minimum VS Code engine to `^1.75.0`
- Expand `semanticTokenColors` in dark theme (4 → 37 keys: variable, parameter, class, interface, namespace, method, decorator, modifier, keyword, string, number, operator + `deprecated`/`abstract`/`static` modifiers)
- Add `semanticTokenColors` to light theme (full parity with dark, IntelliJ Light palette)
- Port Java, Kotlin, C/C++, C#, LaTeX, DBML and log syntax coloring to light theme
- Add markdown/diff/invalid token scopes to light theme
- Add modern workbench color keys to both themes: `commandCenter.*`, `chat.*`, `inlineChat.*`, `notebook.*`, `profileBadge.*`, `editorStickyScroll*`, `editor.linkedEditingBackground`, `editorLineNumber.dimmedForeground`, `testing.*`, `charts.*`, `scm.historyItem*`
- Convert colors that must be transparent to `#RRGGBBAA` while preserving visual appearance on the editor background (line/stack-frame/linked-editing/selection/find-match/word-highlight/inactive-selection highlights, notebook cell backgrounds, merge conflict backgrounds, minimap and overview ruler markers)
- Make light theme scrollbar slider translucent so overview ruler markers show through
- Fix terminal cursor color to improve visibility (light theme)
- Fix typo in keyword `rubymiine` → `rubymine`

## 0.6.0

- Add C# support for dark theme
- Fix Python 3.12 generics syntax (PEP 695)
- Add LaTeX Syntax colors

## 0.5.0

- Add C/C++ syntax colors
- Add Java syntax colors
- Add Kotlin syntax colors

## 0.4.0

- Add gitDecoration colors

## 0.3.0

- Add DBML syntax

## 0.2.1

- Fix go map color

## 0.2.0

- Add go struct tags colors

## 0.1.1

- Fix entity.name.function scope

## 0.1.0

- Add php syntax colors

## 0.0.2

- Fix diffEditor colors transparency
- Add compatible extensions list to readme

## 0.0.1

- Initial release
