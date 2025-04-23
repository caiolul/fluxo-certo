"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { deleteExpense } from "@/lib/actions"
import { useRouter } from "next/navigation"

// Simulação de dados - em um app real, estes viriam do banco de dados
const mockExpenses = [
  {
    id: "1",
    description: "Supermercado",
    amount: 250.75,
    category: "alimentacao",
    date: new Date(2023, 3, 15),
  },
  {
    id: "2",
    description: "Conta de luz",
    amount: 120.5,
    category: "moradia",
    date: new Date(2023, 3, 10),
  },
  {
    id: "3",
    description: "Uber",
    amount: 35.2,
    category: "transporte",
    date: new Date(2023, 3, 8),
  },
  {
    id: "4",
    description: "Farmácia",
    amount: 89.9,
    category: "saude",
    date: new Date(2023, 3, 5),
  },
  {
    id: "5",
    description: "Cinema",
    amount: 60.0,
    category: "lazer",
    date: new Date(2023, 3, 2),
  },
]

const categories = [
  { id: "alimentacao", name: "Alimentação" },
  { id: "transporte", name: "Transporte" },
  { id: "moradia", name: "Moradia" },
  { id: "saude", name: "Saúde" },
  { id: "educacao", name: "Educação" },
  { id: "lazer", name: "Lazer" },
  { id: "outros", name: "Outros" },
]

export function ExpenseList() {
  const { toast } = useToast()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)

  // Em um app real, usaríamos um hook para buscar os dados do servidor
  const expenses = mockExpenses

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "" || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete)
        toast({
          title: "Gasto excluído",
          description: "O gasto foi excluído com sucesso!",
        })
        router.refresh()
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o gasto. Tente novamente.",
          variant: "destructive",
        })
      }
    }
    setDeleteDialogOpen(false)
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor (R$)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>{getCategoryName(expense.category)}</TableCell>
                  <TableCell>{format(expense.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum gasto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
