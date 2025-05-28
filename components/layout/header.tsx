import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">OfferHub</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">Categories</Button>
          <Button variant="ghost">About</Button>
          <Button>Contact</Button>
        </nav>
      </div>
    </header>
  );
}
