import { Card, CardBody, Button } from "@heroui/react";
import { Link } from "@inertiajs/react";
import { AlertTriangle, Home } from "lucide-react";

export default function ServerError(props: { error: any }) {
  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Error Card */}
          <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
            <CardBody className="gap-6 p-8">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle size={32} className="text-red-400" />
                </div>
              </div>

              {/* Error Content */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-white">500</h1>
                <h2 className="text-xl font-bold text-zinc-100">Erro no Servidor</h2>
                <p className="text-sm text-zinc-400">
                  Oh não, algo deu errado. Nossos mestres estão tentando consertar.
                </p>
              </div>

              {/* Error Details */}
              {props.error?.message && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                  <p className="text-xs text-red-400 font-mono break-words">
                    {props.error.message}
                  </p>
                </div>
              )}

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
                  onPress={() => window.location.reload()}
                >
                  Recarregar Página
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}