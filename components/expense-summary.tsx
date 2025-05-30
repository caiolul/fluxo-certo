"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"
import { getExpenses } from "@/lib/actions"

const categories = [
  { id: "alimentacao", name: "Alimentação", color: "#FF6384" },
  { id: "transporte", name: "Transporte", color: "#36A2EB" },
  { id: "moradia", name: "Moradia", color: "#FFCE56" },
  { id: "saude", name: "Saúde", color: "#4BC0C0" },
  { id: "educacao", name: "Educação", color: "#9966FF" },
  { id: "lazer", name: "Lazer", color: "#FF9F40" },
  { id: "outros", name: "Outros", color: "#C9CBCF" },
]

const periods = [
  { id: "7dias", name: "Últimos 7 dias" },
  { id: "30dias", name: "Últimos 30 dias" },
  { id: "90dias", name: "Últimos 90 dias" },
  { id: "ano", name: "Este ano" },
]

export function ExpenseSummary() {
  const [period, setPeriod] = useState("30dias")
  const [expenses, setExpenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses()
        setExpenses(data || [])
      } catch (error) {
        console.error("Erro ao buscar gastos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  if (isLoading) {
    return <div className="text-center py-4">Carregando...</div>
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const pieChartData = categories
    .map((category) => {
      const categoryExpenses = expenses.filter((expense) => expense.category === category.id)
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      return {
        name: category.name,
        value: total,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)

  const barChartData = categories
    .map((category) => {
      const categoryExpenses = expenses.filter((expense) => expense.category === category.id)
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      return {
        name: category.name,
        total,
      }
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total)

  const topCategory = barChartData.length > 0 ? barChartData[0] : { name: "Nenhum", total: 0 }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{periods.find((p) => p.id === period)?.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Categoria</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory.name}</div>
            <p className="text-xs text-muted-foreground">R$ {topCategory.total.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalExpenses / 30).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Baseado nos últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categorias" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          <TabsTrigger value="grafico">Gráfico de Pizza</TabsTrigger>
        </TabsList>
        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(value) => `R$ ${value}`} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip
                      formatter={(value) => [`R$ ${value}`, "Total"]}
                      cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grafico">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip formatter={(value) => [`R$ ${value}`, "Total"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
