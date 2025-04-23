"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"

// Simulação de dados - em um app real, estes viriam do banco de dados
const mockExpenses = [
  { id: "1", description: "Supermercado", amount: 250.75, category: "alimentacao", date: new Date(2023, 3, 15) },
  { id: "2", description: "Conta de luz", amount: 120.5, category: "moradia", date: new Date(2023, 3, 10) },
  { id: "3", description: "Uber", amount: 35.2, category: "transporte", date: new Date(2023, 3, 8) },
  { id: "4", description: "Farmácia", amount: 89.9, category: "saude", date: new Date(2023, 3, 5) },
  { id: "5", description: "Cinema", amount: 60.0, category: "lazer", date: new Date(2023, 3, 2) },
  { id: "6", description: "Restaurante", amount: 120.0, category: "alimentacao", date: new Date(2023, 3, 20) },
  { id: "7", description: "Conta de água", amount: 80.3, category: "moradia", date: new Date(2023, 3, 12) },
  { id: "8", description: "Livros", amount: 150.0, category: "educacao", date: new Date(2023, 3, 18) },
]

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

  // Em um app real, filtraríamos os dados com base no período selecionado
  const expenses = mockExpenses

  // Calcular total de gastos
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Dados para o gráfico de pizza por categoria
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

  // Dados para o gráfico de barras por categoria
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

  // Encontrar a categoria com maior gasto
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
