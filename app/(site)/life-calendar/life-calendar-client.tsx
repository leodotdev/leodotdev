"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

interface CalendarMonth {
  year: number;
  month: number;
  monthName: string;
  days: CalendarDay[];
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Colors for each month using Tailwind/shadcn palette
const monthColors: { [key: number]: string } = {
  0: "bg-yellow-200 dark:bg-yellow-900/30", // Jan
  1: "bg-yellow-200 dark:bg-yellow-900/30", // Feb
  2: "bg-orange-200 dark:bg-orange-900/30", // Mar
  3: "bg-red-300 dark:bg-red-900/30", // Apr
  4: "bg-pink-300 dark:bg-pink-900/30", // May
  5: "bg-pink-400 dark:bg-pink-900/40", // Jun
  6: "bg-purple-300 dark:bg-purple-900/30", // Jul
  7: "bg-purple-400 dark:bg-purple-900/40", // Aug
  8: "bg-blue-300 dark:bg-blue-900/30", // Sep
  9: "bg-cyan-300 dark:bg-cyan-900/30", // Oct
  10: "bg-green-300 dark:bg-green-900/30", // Nov
  11: "bg-green-400 dark:bg-green-900/40", // Dec
};

function getDaysInMonth(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const days: CalendarDay[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({
      date: new Date(year, month, 0),
      dayNumber: 0,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: false,
    });
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === today.toDateString();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    days.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday,
      isWeekend,
    });
  }

  // Add empty cells to complete the last week
  const remainingCells = 35 - days.length; // 5 weeks minimum
  for (let i = 0; i < remainingCells; i++) {
    days.push({
      date: new Date(year, month + 1, i + 1),
      dayNumber: 0,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: false,
    });
  }

  return days;
}

function generateCalendarYear(year: number): CalendarMonth[] {
  const months: CalendarMonth[] = [];
  for (let month = 0; month < 12; month++) {
    months.push({
      year,
      month,
      monthName: monthNames[month],
      days: getDaysInMonth(year, month),
    });
  }
  return months;
}

export function LifeCalendar() {
  const [years, setYears] = useState<{ [key: number]: CalendarMonth[] }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const todayRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  // Load initial years around current year
  useEffect(() => {
    const initialYears: { [key: number]: CalendarMonth[] } = {};
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      initialYears[year] = generateCalendarYear(year);
    }
    setYears(initialYears);
  }, [currentYear]);

  // Scroll to today on initial load
  useEffect(() => {
    if (todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }, 100);
    }
  }, [years]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Store scroll position
    scrollPositionRef.current = scrollTop;
    
    // Load more years when scrolling near top or bottom
    if (scrollTop < 2000) {
      const earliestYear = Math.min(...Object.keys(years).map(Number));
      const newYears = { ...years };
      for (let year = earliestYear - 5; year < earliestYear; year++) {
        if (!newYears[year]) {
          newYears[year] = generateCalendarYear(year);
        }
      }
      setYears(newYears);
    }

    if (scrollTop + clientHeight > scrollHeight - 2000) {
      const latestYear = Math.max(...Object.keys(years).map(Number));
      const newYears = { ...years };
      for (let year = latestYear + 1; year <= latestYear + 5; year++) {
        if (!newYears[year]) {
          newYears[year] = generateCalendarYear(year);
        }
      }
      setYears(newYears);
    }
  };

  const loadPreviousYear = (year: number) => {
    const newYears = { ...years };
    const targetYear = year - 1;
    if (!newYears[targetYear]) {
      newYears[targetYear] = generateCalendarYear(targetYear);
      setYears(newYears);
      // Scroll to the new year after it's rendered
      setTimeout(() => {
        const yearElement = document.getElementById(`year-${targetYear}`);
        if (yearElement) {
          yearElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const loadNextYear = (year: number) => {
    const newYears = { ...years };
    const targetYear = year + 1;
    if (!newYears[targetYear]) {
      newYears[targetYear] = generateCalendarYear(targetYear);
      setYears(newYears);
      // Scroll to the new year after it's rendered
      setTimeout(() => {
        const yearElement = document.getElementById(`year-${targetYear}`);
        if (yearElement) {
          yearElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const sortedYears = Object.keys(years)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Fixed header with day labels */}
      <div className="sticky top-0 z-20 bg-background border-b border-black/10 dark:border-white/10">
        <div className="grid grid-cols-[80px_repeat(35,_1fr)] gap-0">
          <div className="p-2 font-semibold text-right border-r border-black/10 dark:border-white/10"></div>
          {Array.from({ length: 5 }, (_, weekIndex) => 
            dayHeaders.map((day, dayIndex) => (
              <div 
                key={`${weekIndex}-${dayIndex}`} 
                className={cn(
                  "border-r border-black/10 dark:border-white/10 py-2 text-center text-xs font-semibold",
                  (dayIndex === 0 || dayIndex === 6) && "bg-orange-100 dark:bg-orange-900/20"
                )}
              >
                {day}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Scrollable calendar content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onScroll={handleScroll}
      >
        <div className="w-full">
          {sortedYears.map((year, yearIndex) => (
            <div key={year} id={`year-${year}`}>
              {/* Load previous year button */}
              {year === currentYear && yearIndex > 0 && (
                <div className="flex justify-center py-4 bg-background border-b border-black/5 dark:border-white/5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPreviousYear(year)}
                    className="flex items-center gap-2"
                  >
                    <ChevronUp className="h-4 w-4" />
                    Load {year - 1}
                  </Button>
                </div>
              )}
              
              {/* Year header - smaller, plainer, left-aligned */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground border-b border-black/5 dark:border-white/5">
                {year}
              </div>
              
              {/* Months */}
              {years[year].map((month) => {
                const hasToday = month.days.some(day => day.isToday);
                
                return (
                  <div 
                    key={`${year}-${month.month}`}
                    ref={hasToday ? todayRef : undefined}
                    className="grid grid-cols-[80px_repeat(35,_1fr)] gap-0 border-b border-black/5 dark:border-white/5"
                  >
                    {/* Month name */}
                    <div className={cn(
                      monthColors[month.month],
                      "py-3 px-2 font-semibold text-right border-r border-black/10 dark:border-white/10 text-sm"
                    )}>
                      {month.monthName}
                    </div>
                    
                    {/* Days - taller cells */}
                    {month.days.map((day, index) => (
                      <div
                        key={index}
                        data-today={day.isToday}
                        className={cn(
                          "border-r border-black/5 dark:border-white/5 py-2 text-center text-xs transition-all",
                          !day.isCurrentMonth || day.dayNumber === 0 && "bg-muted/50 text-muted-foreground",
                          day.isCurrentMonth && day.dayNumber > 0 && !day.isToday && "bg-background",
                          day.isWeekend && day.isCurrentMonth && day.dayNumber > 0 && !day.isToday && "bg-orange-100 dark:bg-orange-900/20",
                          day.isToday && "bg-destructive text-destructive-foreground font-bold"
                        )}
                      >
                        {day.dayNumber > 0 ? day.dayNumber : ''}
                      </div>
                    ))}
                  </div>
                );
              })}
              
              {/* Load next year button */}
              {year === currentYear && yearIndex < sortedYears.length - 1 && (
                <div className="flex justify-center py-4 bg-background border-b border-black/5 dark:border-white/5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadNextYear(year)}
                    className="flex items-center gap-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Load {year + 1}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}