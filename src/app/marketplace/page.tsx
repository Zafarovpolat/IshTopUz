
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobBoard } from "@/app/jobs/page";
import { KworksCatalog } from "@/app/projects/page";

export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Биржа</h1>
          <p className="mt-4 text-lg text-muted-foreground">Находите проекты, предлагайте услуги и работайте безопасно.</p>
        </div>

        <Tabs defaultValue="find-work" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto mb-8">
            <TabsTrigger value="find-work">Найти работу</TabsTrigger>
            <TabsTrigger value="buy-project">Купить проект</TabsTrigger>
          </TabsList>
          <TabsContent value="find-work">
            <JobBoard />
          </TabsContent>
          <TabsContent value="buy-project">
            <KworksCatalog />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}
