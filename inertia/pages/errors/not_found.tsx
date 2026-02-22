import { Card, CardBody, Button } from "@heroui/react";
import { Link } from "@inertiajs/react";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* 404 Card */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
            <CardBody className="gap-6 p-8">
              {/* 404 Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Search size={32} className="text-amber-400" />
                </div>
              </div>

              {/* 404 Content */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-white">404</h1>
                <h2 className="text-xl font-bold text-zinc-100">Página não Encontrada</h2>
                <p className="text-sm text-zinc-400">
                  Parece que você se perdeu. Esta página não existe em nosso reino.
                </p>
              </div>

              {/* Decorative Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 text-center">
                <p className="text-xs text-blue-400">
                  A página que você procura pode ter sido movida ou deletada.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/" className="w-full">
                  <Button 
                    color="primary" 
                    size="lg" 
                    className="w-full font-bold"
                  >
                    <Home size={16} />
                    Voltar para Início
                  </Button>
                </Link>
                <Button 
                  variant="bordered" 
                  size="lg" 
                  className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 font-bold"
                  onPress={() => window.history.back()}
                >
                  Voltar Atrás
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}