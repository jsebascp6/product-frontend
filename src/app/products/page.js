"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaEdit } from 'react-icons/fa'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        Authorization: 'Basic ' + btoa('admin:password'),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products')
        }
        return res.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b py-2 flex justify-between items-center">
            <span>{product.id} - {product.name} - ${product.price}</span>
            <Link href={`/products/${product.id}/edit`} className="text-blue-500">
              <FaEdit className="inline-block ml-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
