"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addExpense } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

const expenseFormSchema = z.object({
  description: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres" }),
  amount: z.coerce.number().positive({ message: "O valor deve ser positivo" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  date: z.date(),
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

const categories = [
  { id: "alimentacao", name: "Alimentação" },
  { id: "transporte", name: "Transporte" },
  { id: "moradia", name: "Moradia" },
  { id: "saude", name: "Saúde" },
  { id: "educacao", name: "Educação" },
  { id: "lazer", name: "Lazer" },
  { id: "outros", name: "Outros" },
]

export function ExpenseForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      date: new Date(),
    },
  })

  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true)
    try {
      const result = await addExpense({
        description: data.description,
        amount: data.amount,
        category: data.category,
        date: data.date,
      })

      if (result) {
        toast({
          title: "Gasto adicionado",
          description: "Seu gasto foi registrado com sucesso!",
        })

        form.reset()
        router.refresh()
      } else {
        throw new Error("Falha ao adicionar gasto")
      }
    } catch (error) {
      console.error("Erro ao adicionar gasto:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o gasto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input 
          id="description" 
          placeholder="Ex: Supermercado, Restaurante, etc." 
          {...form.register("description")} 
          disabled={isSubmitting}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input 
          id="amount" 
          type="number" 
          step="0.01" 
          placeholder="0.00" 
          {...form.register("amount")} 
          disabled={isSubmitting}
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select 
          onValueChange={(value) => form.setValue("category", value)}
          disabled={isSubmitting}
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
        {form.formState.errors.category && (
          <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !form.getValues("date") && "text-muted-foreground",
              )}
              disabled={isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.getValues("date") ? (
                format(form.getValues("date"), "PPP", { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.getValues("date")}
              onSelect={(date) => date && form.setValue("date", date)}
              initialFocus
              locale={ptBR}
              disabled={isSubmitting}
            />
          </PopoverContent>
        </Popover>
        {form.formState.errors.date && (
          <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adicionando..." : "Adicionar Gasto"}
      </Button>
    </form>
  )
}
