"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState(null)

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
          setGeneralError(error.message)
          setLoading(false)
        })
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError(null)

    const updatedProduct = { name, description, price: parseFloat(price) }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:password'),
        },
        body: JSON.stringify({ product: updatedProduct }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 422) {
          setErrors(data)
        } else {
          throw new Error('Failed to update product')
        }
        setLoading(false)
        return
      }

      router.push('/products')
    } catch (error) {
      setGeneralError(error.message)
      setLoading(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (generalError) return <p>Error: {generalError}</p>

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
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
        {generalError && <p className="text-red-500">{generalError}</p>}
        <div className="flex justify-between items-center">
          <Link href="/products" className="text-gray-500 hover:text-gray-700 transition-colors">
            Back to Products
          </Link>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
