"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "./db"

export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: Date
}

export async function addExpense(data: Omit<Expense, "id">) {
  try {
    // Validar os dados antes de inserir
    if (!data.description || !data.category || !data.date || data.amount <= 0) {
      throw new Error("Dados inválidos")
    }

    // Garantir que a data seja um objeto Date
    const date = data.date instanceof Date ? data.date : new Date(data.date)

    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        date: date,
      },
    })

    revalidatePath("/")
    return expense
  } catch (error) {
    console.error("Error adding expense:", error)
    if (error instanceof Error) {
      throw new Error(`Erro ao adicionar gasto: ${error.message}`)
    }
    throw new Error("Erro ao adicionar gasto")
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting expense:", error)
    throw new Error("Failed to delete expense")
  }
}

export async function updateExpense(id: string, data: Partial<Omit<Expense, "id">>) {
  try {
    await prisma.expense.update({
      where: { id },
      data,
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating expense:", error)
    throw new Error("Failed to update expense")
  }
}

export async function getExpenses() {
  try {
    return await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    throw new Error("Failed to fetch expenses")
  }
}
