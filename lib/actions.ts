"use server"

import { revalidatePath } from "next/cache"

// Tipos para os dados
export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: Date
}

// Em um app real, estas funções interagiriam com um banco de dados
export async function addExpense(data: Omit<Expense, "id">) {
  // Simulação de adição ao banco de dados
  console.log("Adicionando gasto:", data)

  // Em um app real, aqui você usaria Prisma, Drizzle ou outro ORM
  // const expense = await db.expense.create({ data })

  // Revalidar o cache para atualizar os dados na UI
  revalidatePath("/")

  return { id: Math.random().toString(36).substring(7) }
}

export async function deleteExpense(id: string) {
  // Simulação de remoção do banco de dados
  console.log("Excluindo gasto:", id)

  // Em um app real, aqui você usaria Prisma, Drizzle ou outro ORM
  // await db.expense.delete({ where: { id } })

  // Revalidar o cache para atualizar os dados na UI
  revalidatePath("/")

  return { success: true }
}

export async function updateExpense(id: string, data: Partial<Omit<Expense, "id">>) {
  // Simulação de atualização no banco de dados
  console.log("Atualizando gasto:", id, data)

  // Em um app real, aqui você usaria Prisma, Drizzle ou outro ORM
  // await db.expense.update({ where: { id }, data })

  // Revalidar o cache para atualizar os dados na UI
  revalidatePath("/")

  return { success: true }
}

export async function getExpenses() {
  // Simulação de busca no banco de dados
  // Em um app real, aqui você usaria Prisma, Drizzle ou outro ORM
  // return await db.expense.findMany({ orderBy: { date: 'desc' } })

  // Retornando dados simulados
  return [
    { id: "1", description: "Supermercado", amount: 250.75, category: "alimentacao", date: new Date(2023, 3, 15) },
    { id: "2", description: "Conta de luz", amount: 120.5, category: "moradia", date: new Date(2023, 3, 10) },
    { id: "3", description: "Uber", amount: 35.2, category: "transporte", date: new Date(2023, 3, 8) },
    { id: "4", description: "Farmácia", amount: 89.9, category: "saude", date: new Date(2023, 3, 5) },
    { id: "5", description: "Cinema", amount: 60.0, category: "lazer", date: new Date(2023, 3, 2) },
  ]
}
