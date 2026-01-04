'use client'
import { BlogData } from '@/types/blog/type';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'


interface BlogDataContextType {
  blogData: BlogData | null;
  isLoading: boolean;
  error: string | null;
}

const BlogDataContext = createContext<BlogDataContextType | undefined>(undefined)

export function BlogDataProvider({ children }: { children: ReactNode }) {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch('/api/blog')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '获取数据失败')
        }

        setBlogData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
        console.error('获取博客设置数据失败:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogData()
  }, [])

  return (
    <BlogDataContext.Provider value={{ blogData, isLoading, error }}>
      {children}
    </BlogDataContext.Provider>
  )
}

export function useBlogDataContext() {
  const context = useContext(BlogDataContext)
  if (context === undefined) {
    throw new Error('useBlogDataContext must be used within a BlogDataProvider')
  }
  return context
}
