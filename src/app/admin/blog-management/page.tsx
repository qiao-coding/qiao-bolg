'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  BarChart2,
  PieChart,
  Users,
  Tag,
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/shadcnComponents/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/shadcnComponents/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/shadcnComponents/dropdown-menu';
import {
  Button
} from '@/components/ui/shadcnComponents/button';
import {
  Badge
} from '@/components/ui/shadcnComponents/badge';
import {
  Input
} from '@/components/ui/shadcnComponents/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/shadcnComponents/avatar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';

// 文章类型定义
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  author: string;
  authorAvatar: string;
  createTime: string;
  updateTime: string;
  views: number;
  comments: number;
  likes: number;
}

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'React Hooks 完全指南',
    excerpt: '本文详细介绍了React Hooks的使用方法和最佳实践，包括useState、useEffect、useContext等常用钩子...',
    category: '前端开发',
    tags: ['React', 'JavaScript', '前端'],
    status: 'published',
    author: '张三',
    authorAvatar: '/UserImage/up.jpg',
    createTime: '2024-09-01T10:30:00',
    updateTime: '2024-09-02T14:20:00',
    views: 1243,
    comments: 23,
    likes: 89
  },
  {
    id: '2',
    title: 'TypeScript 进阶技巧分享',
    excerpt: '探索TypeScript的高级特性，提升代码质量和开发效率...',
    category: '前端开发',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    status: 'published',
    author: '李四',
    authorAvatar: '/UserImage/up.jpg',
    createTime: '2024-08-28T09:15:00',
    updateTime: '2024-08-28T09:15:00',
    views: 876,
    comments: 14,
    likes: 56
  },
  {
    id: '3',
    title: 'Next.js 14 新特性解析',
    excerpt: '深入了解Next.js 14的最新特性，包括App Router、Server Components等...',
    category: '前端框架',
    tags: ['Next.js', 'React', 'SSR'],
    status: 'draft',
    author: '王五',
    authorAvatar: '/UserImage/up.jpg',
    createTime: '2024-09-03T16:45:00',
    updateTime: '2024-09-03T16:45:00',
    views: 0,
    comments: 0,
    likes: 0
  },
  {
    id: '4',
    title: 'Tailwind CSS 响应式设计最佳实践',
    excerpt: '掌握Tailwind CSS的响应式设计技巧，构建优雅的用户界面...',
    category: 'CSS框架',
    tags: ['Tailwind CSS', '响应式设计', 'CSS'],
    status: 'published',
    author: '赵六',
    authorAvatar: '/UserImage/up.jpg',
    createTime: '2024-08-25T11:20:00',
    updateTime: '2024-08-26T15:30:00',
    views: 1532,
    comments: 32,
    likes: 124
  },
  {
    id: '5',
    title: '前端工程师的职业规划思考',
    excerpt: '分享前端工程师的职业发展路径和技能提升建议...',
    category: '职业发展',
    tags: ['职业规划', '前端', '技能提升'],
    status: 'published',
    author: '张三',
    authorAvatar: '/UserImage/up.jpg',
    createTime: '2024-08-20T14:10:00',
    updateTime: '2024-08-20T14:10:00',
    views: 2103,
    comments: 56,
    likes: 234
  }
];

// 图表数据
const articleStatsData = [
  { name: '1月', 发布数量: 12, 浏览量: 1500 },
  { name: '2月', 发布数量: 19, 浏览量: 2300 },
  { name: '3月', 发布数量: 15, 浏览量: 1800 },
  { name: '4月', 发布数量: 25, 浏览量: 3200 },
  { name: '5月', 发布数量: 22, 浏览量: 2800 },
  { name: '6月', 发布数量: 30, 浏览量: 3800 },
  { name: '7月', 发布数量: 28, 浏览量: 3500 },
  { name: '8月', 发布数量: 32, 浏览量: 4200 },
  { name: '9月', 发布数量: 18, 浏览量: 2500 }
];

const categoryData = [
  { name: '前端开发', value: 45, color: '#0088FE' },
  { name: '前端框架', value: 25, color: '#00C49F' },
  { name: 'CSS框架', value: 15, color: '#FFBB28' },
  { name: '职业发展', value: 10, color: '#FF8042' },
  { name: '其他', value: 5, color: '#8884d8' }
];

// 状态标签样式映射
const statusBadgeStyles = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  draft: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
};

// 状态图标映射
const statusIcons = {
  published: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  draft: <Clock className="h-4 w-4 text-blue-500" />,
  archived: <Circle className="h-4 w-4 text-gray-500" />
};

const BlogManagementPage: React.FC = () => {
  const [articles] = useState<Article[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Article | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    if (sortField === 'createTime' || sortField === 'updateTime') {
      valueA = new Date(typeof valueA === 'string' ? valueA : '').getTime();
      valueB = new Date(typeof valueB === 'string' ? valueB : '').getTime();
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Article) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  const toggleArticleSelection = (id: string) => {
    setSelectedArticles(prev => 
      prev.includes(id) 
        ? prev.filter(articleId => articleId !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(article => article.id));
    }
  };

  const allCategories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-col gap-4 py-4 px-6 md:gap-6 md:py-6 border-b mb-4">
        <div>
          <h1 className="text-2xl font-bold">博客管理</h1>
          <p className="text-muted-foreground">管理和查看所有博客内容</p>
        </div>
      </header>

      <div className="px-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blog-management">
            <Button variant="default" size="sm" className="gap-1">
              <BookOpen className="h-4 w-4" />
              <span>文章管理</span>
            </Button>
          </Link>
          <Link href="/admin/blog-management/categories">
            <Button variant="ghost" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              <span>分类管理</span>
            </Button>
          </Link>
          <Link href="/admin/blog-management/tags">
            <Button variant="ghost" size="sm" className="gap-1">
              <Tag className="h-4 w-4" />
              <span>标签管理</span>
            </Button>
          </Link>
        </div>
      </div>

      <main className="p-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总文章数</p>
                  <h3 className="text-2xl font-bold mt-1">{articles.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>12% 较上月</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">已发布</p>
                  <h3 className="text-2xl font-bold mt-1">{articles.filter(a => a.status === 'published').length}</h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>8% 较上月</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">草稿</p>
                  <h3 className="text-2xl font-bold mt-1">{articles.filter(a => a.status === 'draft').length}</h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-red-600 dark:text-red-400">
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>5% 较上月</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总浏览量</p>
                  <h3 className="text-2xl font-bold mt-1">{articles.reduce((sum, article) => sum + article.views, 0)}</h3>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>23% 较上月</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>文章发布趋势</CardTitle>
              <CardDescription>过去9个月的文章发布和浏览数据</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={articleStatsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
                  <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="发布数量" fill="#0088FE" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="浏览量" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>文章分类分布</CardTitle>
              <CardDescription>各类别文章占比统计</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>文章列表</CardTitle>
              <CardDescription>管理和编辑所有博客文章</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>新建文章</span>
            </Button>
          </CardHeader>
          
          <CardContent>
            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜索文章标题或摘要..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">全部分类</option>
                  {allCategories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">全部状态</option>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="archived">已归档</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedArticles.length > 0 && selectedArticles.length === filteredArticles.length}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>标题</span>
                        {sortField === 'title' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>分类</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>标签</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>状态</span>
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('createTime')}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>创建时间</span>
                        {sortField === 'createTime' && (
                          sortDirection === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>浏览量</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        没有找到匹配的文章
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedArticles.includes(article.id)}
                            onChange={() => toggleArticleSelection(article.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{article.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="bg-[#F0F0F0] text-[#333333]">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {statusIcons[article.status]}
                            <Badge className={statusBadgeStyles[article.status]}>
                              {article.status === 'published' ? '已发布' : 
                               article.status === 'draft' ? '草稿' : '已归档'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(article.createTime)}</TableCell>
                        <TableCell>{article.views}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">打开菜单</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" />
                                <span>编辑</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                <span>查看</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>删除</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                显示 {Math.min(1, filteredArticles.length)} 到 {Math.min(10, filteredArticles.length)} 条，共 {filteredArticles.length} 条
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" disabled>上一页</Button>
                <Button size="sm" variant="default" disabled>1</Button>
                <Button size="sm" variant="ghost" disabled>下一页</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlogManagementPage;