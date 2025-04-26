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
    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        category: data.category,
        date: data.date,
      },
    })

    revalidatePath("/")
    return expense
  } catch (error) {
    console.error("Error adding expense:", error)
    throw new Error("Failed to add expense")
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
