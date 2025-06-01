"use client";

import { LifeCalendar } from "./life-calendar-client";
import { ThemeSwitcher } from "@/app/theme-switcher";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export default function LifeCalendarPage() {
  const scrollToToday = () => {
    const todayElement = document.querySelector('[data-today="true"]');
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a brief highlight effect
      todayElement.classList.add("ring-4", "ring-destructive", "ring-offset-2");
      setTimeout(() => {
        todayElement.classList.remove("ring-4", "ring-destructive", "ring-offset-2");
      }, 2000);
    }
  };

  return (
    <>
      <LifeCalendar />
      {/* FAB buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button
          size="icon"
          onClick={scrollToToday}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Go to Today"
        >
          <CalendarDays className="h-6 w-6" />
        </Button>
        <ThemeSwitcher className="h-14 w-14 shadow-lg hover:shadow-xl transition-shadow" />
      </div>
    </>
  );
}