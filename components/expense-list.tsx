"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit2, Trash2, CalendarIcon } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { deleteExpense, getExpenses, updateExpense } from "@/lib/actions"
import { useRouter } from "next/navigation"

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
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  })

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses()
        setExpenses(data || [])
      } catch (error) {
        console.error("Erro ao buscar gastos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os gastos. Tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [toast])

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (expense: any) => {
    // console.log('Editando despesa:', expense);
    setExpenseToEdit(expense)
    setEditForm({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date),
    })
    console.log('Data formatada:', new Date(expense.date));
    setEditDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete)
        setExpenses(expenses.filter(expense => expense.id !== expenseToDelete))
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

  const handleEditSubmit = async () => {
    if (expenseToEdit) {
      try {
        await updateExpense(expenseToEdit.id, {
          description: editForm.description,
          amount: Number(editForm.amount),
          category: editForm.category,
          date: editForm.date,
        })

        // Atualizar a lista de gastos
        const updatedExpenses = expenses.map(expense => 
          expense.id === expenseToEdit.id 
            ? { ...expense, ...editForm, amount: Number(editForm.amount) }
            : expense
        )
        setExpenses(updatedExpenses)

        toast({
          title: "Gasto atualizado",
          description: "O gasto foi atualizado com sucesso!",
        })
        router.refresh()
        setEditDialogOpen(false)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao atualizar o gasto. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId
  }

  if (isLoading) {
    return <div className="text-center py-4">Carregando...</div>
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum gasto registrado</h3>
        <p className="text-gray-500 mb-4">Adicione seu primeiro gasto para começar a controlar suas despesas.</p>
        <Button onClick={() => router.push("/")}>Adicionar Gasto</Button>
      </div>
    )
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
                  <TableCell>{format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditClick(expense)}
                      >
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen} modal={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Gasto</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias e clique em salvar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="description">Descrição</label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount">Valor (R$)</label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Categoria</label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="date">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editForm.date && "text-muted-foreground"
                    )}
                    onClick={() => (editForm.date)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editForm.date ? (
                      format(editForm.date, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                  <Calendar
                    mode="single"
                    selected={editForm.date}
                    onSelect={(date) => {
                      // console.log('Data selecionada:', date);
                      if (date) {
                        setEditForm({ ...editForm, date })
                        // console.log('Nova data no form:', date);
                      }
                    }}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
