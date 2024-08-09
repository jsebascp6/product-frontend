"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        headers: {
          Authorization: 'Basic ' + btoa('admin:password'),
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch product')
          }
          return res.json()
        })
        .then((data) => {
          setName(data.name)
          setDescription(data.description)
          setPrice(data.price)
          setLoading(false)
        })
        .catch((error) => {
          setError(error.message)
          setLoading(false)
        })
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const updatedProduct = { name, description, price: parseFloat(price) }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'PATCH', // Usar PATCH para actualizar el producto
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:password'),
        },
        body: JSON.stringify({ product: updatedProduct }),
      })

      if (!res.ok) {
        throw new Error('Failed to update product')
      }

      router.push('/products')
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  )
}

