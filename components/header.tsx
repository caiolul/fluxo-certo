import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-bold">Controle de Gastos</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}
