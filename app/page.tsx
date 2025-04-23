import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseSummary } from "@/components/expense-summary"
import { PlusCircle, BarChart3, ListFilter } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Controle de Gastos</h1>
          <p className="text-muted-foreground">Gerencie seus gastos de forma simples e eficiente</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <ListFilter className="mr-2 h-4 w-4" />
              Gastos
            </TabsTrigger>
            <TabsTrigger value="add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Gastos</CardTitle>
                <CardDescription>Visualize o resumo dos seus gastos por categoria e período</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseSummary />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Gastos</CardTitle>
                <CardDescription>Visualize e gerencie todos os seus gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Gasto</CardTitle>
                <CardDescription>Registre um novo gasto</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
