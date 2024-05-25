'use client'

import { useRouter } from 'next/navigation'
import React from 'react'


const SiteRedirect = () => {
    const router = useRouter()
    router.push("/products")
  return (
    <div>SiteRedirect</div>
  )
}

export default SiteRedirect