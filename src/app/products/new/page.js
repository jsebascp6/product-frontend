"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

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
        const data = await res.json()
        if (res.status === 422) {
          setErrors(data)
        } else {
          throw new Error('Failed to create product')
        }
        setLoading(false)
        return
      }

      router.push('/products')
    } catch (error) {
      setErrors({ general: error.message })
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Name</label>
          <input
            type="text"
            className={`border p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.join(', ')}</p>}
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Description</label>
          <textarea
            className={`border p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.join(', ')}</p>}
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Price</label>
          <input
            type="number"
            className={`border p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.join(', ')}</p>}
        </div>
        {errors.general && <p className="text-red-500">{errors.general}</p>}
        <div className="flex justify-between items-center">
          <Link href="/products" className="text-gray-500 hover:text-gray-700 transition-colors">
            Back to Products
          </Link>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
