P16 split migration: no changes to the original function bodies or table definitions.
Run 00, then 01A, 01B, 01C individually in new SQL Editor tabs, then 02 and 03. Stop if any error. Do not run the original full 01 script. Each chunk commits independently. Do not rerun successful chunks. No live PostgreSQL execution performed. Existing P15 prerequisites apply.
