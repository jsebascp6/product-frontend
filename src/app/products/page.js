"use client"

import { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

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
  }, [deleting])

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Basic ' + btoa('admin:password'),
        },
      })

      if (!res.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(products.filter((product) => product.id !== id))
    } catch (error) {
      setError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
      <div className="mb-6 flex justify-end">
        <Link href="/products/new" className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition-colors">
          <FaPlus className="mr-2" /> Add New Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Id</th>
              <th className="text-left p-4 font-semibold text-gray-600">Name</th>
              <th className="text-left p-4 font-semibold text-gray-600">Description</th>
              <th className="text-left p-4 font-semibold text-gray-600">Price</th>
              <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4 text-gray-700">{product.id}</td>
                <td className="p-4 text-gray-700">{product.name}</td>
                <td className="p-4 text-gray-700">{product.description}</td>
                <td className="p-4 text-gray-700">
                  ${product.price ? parseFloat(product.price).toFixed(2) : "N/A"}
                </td>
                <td className="p-4 flex space-x-4">
                  <Link href={`/products/${product.id}/edit`} className="text-blue-500 hover:text-blue-600 transition-colors">
                    <FaEdit className="inline-block" />
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600 transition-colors">
                    <FaTrash className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
