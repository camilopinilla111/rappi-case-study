import { useEffect, useState } from 'react'

import { productCatalog, type Product } from './db/products'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadProducts() {
      try {
        setStatus('loading')
        setErrorMessage(null)

        const nextProducts = await productCatalog.loadProducts()

        if (!isActive) {
          return
        }

        setProducts(nextProducts)
        setStatus('ready')
      } catch (error) {
        if (!isActive) {
          return
        }

        setStatus('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los productos.',
        )
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <section className="mx-auto w-full max-w-4xl">
        <p className="mb-3 text-sm font-bold uppercase text-slate-500">
          Case Study
        </p>
        <h1 className="text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
          Productos
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Datos de ejemplo cargados en SQLite con sql.js para esta sesión del
          navegador.
        </p>

        <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
            <span>Producto</span>
            <span>Precio</span>
          </div>

          {status === 'loading' && (
            <p className="px-5 py-6 text-sm text-slate-600">
              Inicializando SQLite...
            </p>
          )}

          {status === 'error' && (
            <div className="px-5 py-6">
              <p className="font-semibold text-red-700">
                No se pudieron cargar los productos.
              </p>
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              )}
            </div>
          )}

          {status === 'ready' && (
            <ul className="divide-y divide-slate-100">
              {products.map((product) => (
                <li
                  className="grid grid-cols-[1fr_auto] items-center gap-5 px-5 py-4"
                  key={product.id}
                >
                  <span className="font-medium text-slate-900">
                    {product.name}
                  </span>
                  <span className="tabular-nums text-slate-700">
                    {product.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
