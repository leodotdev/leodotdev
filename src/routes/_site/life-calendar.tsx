import { createFileRoute } from "@tanstack/react-router"
import { LifeCalendar } from "@/components/life-calendar/life-calendar"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { Button } from "@/components/ui/button"
import { TbCalendar } from "react-icons/tb"

export const Route = createFileRoute("/_site/life-calendar")({
  component: LifeCalendarPage,
})

function LifeCalendarPage() {
  const scrollToToday = () => {
    const todayElement = document.querySelector('[data-today="true"]')
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: "smooth", block: "center" })
      // Add a brief highlight effect
      todayElement.classList.add("ring-4", "ring-destructive", "ring-offset-2")
      setTimeout(() => {
        todayElement.classList.remove(
          "ring-4",
          "ring-destructive",
          "ring-offset-2"
        )
      }, 2000)
    }
  }

  return (
    <>
      <LifeCalendar />
      {/* FAB buttons */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        <Button
          size="icon"
          onClick={scrollToToday}
          className="h-14 w-14 rounded-full shadow-lg transition-shadow hover:shadow-xl"
          title="Go to Today"
        >
          <TbCalendar className="h-6 w-6" />
        </Button>
        <ThemeSwitcher className="h-14 w-14 shadow-lg transition-shadow hover:shadow-xl" />
      </div>
    </>
  )
}
