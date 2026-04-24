import { FormEvent, useEffect, useState } from 'react';

import { fetchProducts } from './api';
import { Product, ProductFilters } from './types';

const defaultFilters: ProductFilters = {
  activeOnly: true,
  category: '',
  maxPrice: '',
};

export function App(): JSX.Element {
  const [draftFilters, setDraftFilters] = useState<ProductFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(defaultFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProducts(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const nextProducts = await fetchProducts(appliedFilters);

        if (!ignore) {
          setProducts(nextProducts);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : 'Unexpected error');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      ignore = true;
    };
  }, [appliedFilters]);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts({ activeOnly: false, category: '', maxPrice: '' })
      .then((all) => {
        const unique = [...new Set(all.map((p) => p.category))].sort();
        setCategories(unique);
      })
      .catch(() => {});
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setAppliedFilters(draftFilters);
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Jewelry Catalog</p>
        <h1>Small full-stack signal, backend-first exercise.</h1>
        <p className="hero-copy">
          This UI is intentionally tiny. It lets you exercise the catalog endpoint, toggle the active filter, try the
          basic query params, and see the product field surface grow when the exercise is completed.
        </p>
      </section>

      <section className="panel">
        <form className="filters" onSubmit={handleSubmit}>
          <label className="checkbox-row">
            <input
              checked={draftFilters.activeOnly}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  activeOnly: event.target.checked,
                }))
              }
              type="checkbox"
            />
            Only active products
          </label>

          <label>
            Category
            <select
              value={draftFilters.category}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Max price
            <input
              inputMode="decimal"
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  maxPrice: event.target.value,
                }))
              }
              placeholder="150"
              type="text"
              value={draftFilters.maxPrice}
            />
          </label>

          <button type="submit">Apply filters</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Products</h2>
          <span>{products.length} visible</span>
        </div>

        {isLoading ? <p className="status">Loading products...</p> : null}
        {error ? <p className="status error">{error}</p> : null}

        {!isLoading && !error ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.isActive ? 'Active' : 'Inactive'}</td>
                    <td>{product.stock ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
