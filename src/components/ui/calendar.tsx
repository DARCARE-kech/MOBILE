
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 rounded-2xl shadow-lg bg-darcare-navy/70 border-0", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-base font-serif font-medium text-darcare-gold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent border-darcare-gold/30 text-darcare-gold hover:bg-darcare-gold/10 hover:border-darcare-gold/50 transition-all duration-200"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-darcare-gold/80 rounded-md w-10 font-medium text-sm font-serif",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-xl [&:has([aria-selected].day-outside)]:bg-darcare-gold/20 [&:has([aria-selected])]:bg-darcare-gold/20 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold transition-all duration-200 rounded-xl"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-darcare-gold/80 text-darcare-navy hover:bg-darcare-gold hover:text-darcare-navy focus:bg-darcare-gold focus:text-darcare-navy font-medium shadow-md",
        day_today: "bg-darcare-gold/20 text-darcare-gold border border-darcare-gold/40",
        day_outside:
          "day-outside text-darcare-beige/50 opacity-50 aria-selected:bg-darcare-gold/20 aria-selected:text-darcare-gold aria-selected:opacity-30",
        day_disabled: "text-darcare-beige/30 opacity-30",
        day_range_middle:
          "aria-selected:bg-darcare-gold/20 aria-selected:text-darcare-gold",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
