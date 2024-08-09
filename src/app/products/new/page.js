"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const product = { name, description, price: parseFloat(price) }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:password'),
        },
        body: JSON.stringify({ product }),
      })

      if (!res.ok) {
        throw new Error('Failed to create product')
      }

      router.push('/products')
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Product</h1>
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
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
