## What I Changed

**1. Fixed the default filter bug in `GET /products`**

I started by running the test suite to see the failing test before touching any code. The test made it clear the expected behavior: no query param should return active products only. I traced the bug to the controller — `activeOnly` was defaulting to `false` instead of `true`.

While fixing it I noticed something deeper: even when the frontend explicitly sent `?activeOnly=false`, inactive products still weren't appearing. I added a `console.log` in the controller and saw that `query.activeOnly` was arriving as the string `"false"`, not boolean `false`. The `@Transform` decorator was supposed to handle that conversion but was never running. After checking the toolchain I found the root cause: `tsx` uses esbuild under the hood, and esbuild does not support `emitDecoratorMetadata` even when set in `tsconfig.json`. Without it, `class-transformer` skips decorator processing entirely, so `"false"` stayed a string, and since any non-empty string is truthy in JavaScript, `activeOnly=false` was always treated as `true`. I moved the parsing directly into the controller with an explicit `String(query.activeOnly) === 'true'` check, which works reliably regardless of the runtime.

**2. Added `category` and `maxPrice` filters to `GET /products`**

The frontend was already sending both params, but the backend just wasn't reading them. I worked top-down through the layers: added both fields to `ListProductsCriteria` in the domain, added them to the query DTO with validation, passed them through the controller, and extended the existing `WHERE` clause builder in the PostgreSQL repository with `category = $n` and `price <= $n` conditions. Verified with curl and in the UI.

**3. Added `stock` field end-to-end**

I started from the database and worked up. First wrote a new migration (`002_add_stock_to_products.sql`) adding `stock INTEGER NOT NULL DEFAULT 0` with a non-negative check constraint and ran it. Then propagated the field upward layer by layer: added `stock` to the `Product` and `CreateProduct` domain interfaces, updated the repository to include it in `SELECT`, `INSERT`, `ProductRow`, and `mapProductRow`, added `@IsInt() @Min(0) stock` to the create DTO, and passed it through the controller. Let TypeScript errors guide me to every place that needed updating. The frontend already rendered the Stock column and it showed real values immediately. Confirmed with `POST` curl and in the browser.

**4. Frontend improvements**

Replaced the category text input with a dropdown populated dynamically on mount — a separate fetch that retrieves all products, extracts unique categories, and sorts them alphabetically. Added matching styles to the `select` element so it fits the existing input design.

---

## How I Validated It

- `npm test`: both tests pass green
- Used browser DevTools Network tab to inspect outgoing requests and confirm the params the frontend was actually sending
- Used curl to test the API directly and isolate backend from frontend behavior: `GET /products`, `GET /products?category=rings`, `GET /products?maxPrice=100`, and `POST /products` with `stock`
- UI verified at `http://localhost:5173`: dropdown populates from live data, filters work end-to-end, Stock column shows values

---

## What I Would Improve With More Time

- Add test coverage for the `category` and `maxPrice` filters using the existing fake repository pattern
- Add pagination to `GET /products` — returning an unbounded list works at this scale but would not hold in production
- Replace the on-mount product fetch used to derive categories with a dedicated `GET /categories` endpoint for cleaner separation of concerns
- Add proper error handling in the repository layer so database failures return meaningful HTTP responses instead of unhandled exceptions

---

## AI Tools Used

Used Claude (Sonnet 4.6) as a pair programming assistant throughout, for exploring the codebase, understanding the architecture, debugging the `@Transform` issue, and reviewing changes layer by layer. The React frontend changes (category dropdown and dynamic category fetching) were implemented with Claude's direct assistance, as React is not my primary area. I reviewed, understood, and validated the output before committing. This `SOLUTION.md` was also drafted with Claude's help, based on my step-by-step inputs and decisions made during the session. All decisions and code were written and validated by me.
