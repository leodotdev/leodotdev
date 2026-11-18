import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// One row of the home page's lists, shared by Experience and Recent work so
// the two read as one kind of list: a mark, a title over a line of detail,
// and on the right a name over a place and a date.

/** The row's box: any element (a link, a plain div) that holds a `RowContent`. */
export const ROW =
  "group/item block rounded-[20px] border border-transparent bg-background hover:bg-card md:mx-6"

/** For the name on the right when the row goes somewhere: it reads as the link while the row is hovered. */
export const ROW_LINK = "group-hover/item:text-tint group-hover/item:underline"

export function RowContent({
  logo,
  roundLogo,
  fallback,
  title,
  detail,
  name,
  location,
  duration,
}: {
  /** The mark before the title: a file in `public/` or an image URL. */
  logo?: string | null
  /** Clip the mark to a circle; otherwise it gets slightly rounded corners. */
  roundLogo?: boolean | null
  /** The letter shown when there is no mark. */
  fallback: string
  title?: React.ReactNode
  /** The small line under the title. */
  detail?: React.ReactNode
  /** On the right: who it was with. */
  name?: React.ReactNode
  location?: string | null
  /** When, shown after the location. */
  duration?: string | null
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 p-6">
      <div className="flex min-w-0 flex-row items-center gap-3">
        <Avatar className={roundLogo ? "" : "rounded-md"}>
          <AvatarImage src={logo ?? undefined} alt="" />
          <AvatarFallback className="text-muted-foreground">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          {title && <div>{title}</div>}
          {detail && (
            <div className="text-xs text-pretty text-muted-foreground">
              {detail}
            </div>
          )}
        </div>
      </div>
      <div className="flex max-w-[45%] flex-col items-end gap-1 text-end md:max-w-none md:shrink-0">
        {name && <div>{name}</div>}
        <div className="flex flex-col items-end text-xs md:flex-row md:gap-2">
          {location && <p className="text-muted-foreground">{location}</p>}
          {location && duration && (
            <span className="hidden text-muted-foreground md:inline">·</span>
          )}
          {duration && <p>{duration}</p>}
        </div>
      </div>
    </div>
  )
}
