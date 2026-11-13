import { ContactMenu } from "@/components/Navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function HeroSection() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 px-6 pt-12 md:px-12">
        <div>
          <div className="font-semibold">Leo Succar</div>
          <div className="text-muted-foreground">Designer &amp; Developer</div>
        </div>
        <div className="flex items-center gap-4">
          <ContactMenu />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
