import { Card, CardHeader, CardBody, Input, Button, Link } from "@heroui/react";
import { Head, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Registro - Escudo do Mestre" />

            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

                {/* Card de Registro Centralizado */}
                <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800 shadow-none rounded-lg">
                    <CardHeader className="flex flex-col items-center pb-0 pt-6 border-b border-zinc-800/50">
                        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Criar Conta</h1>
                        <p className="text-zinc-400 text-xs mb-6">Junte-se à Ordem.</p>
                    </CardHeader>

                    <CardBody className="overflow-hidden py-6 gap-0">
                        <form onSubmit={submit} className="flex flex-col gap-4">

                            <div className="flex flex-col gap-2">
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Nome de Agente</label>
                                <Input
                                    type="text"
                                    placeholder="Seu nome"
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: "bg-zinc-950 border-zinc-700 hover:border-zinc-600 group-data-[focus=true]:border-blue-400 group-data-[focus=true]:ring-0 group-data-[focus=true]:ring-offset-0 after:hidden",
                                        input: "text-white placeholder:text-zinc-600 !outline-none focus:!outline-none focus-visible:!outline-none focus:ring-0 focus-visible:ring-0 bg-transparent"
                                    }}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    isInvalid={!!errors.name}
                                />
                                {errors.name && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-2 py-1.5">
                                        <p className="text-xs text-red-400 font-bold">{errors.name}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Email</label>
                                <Input
                                    type="email"
                                    placeholder="seu@email.com"
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: "bg-zinc-950 border-zinc-700 hover:border-zinc-600 group-data-[focus=true]:border-blue-400 group-data-[focus=true]:ring-0 group-data-[focus=true]:ring-offset-0 after:hidden",
                                        input: "text-white placeholder:text-zinc-600 !outline-none focus:!outline-none focus-visible:!outline-none focus:ring-0 focus-visible:ring-0 bg-transparent"
                                    }}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    isInvalid={!!errors.email}
                                />
                                {errors.email && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-2 py-1.5">
                                        <p className="text-xs text-red-400 font-bold">{errors.email}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Senha</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: "bg-zinc-950 border-zinc-700 hover:border-zinc-600 group-data-[focus=true]:border-blue-400 group-data-[focus=true]:ring-0 group-data-[focus=true]:ring-offset-0 after:hidden",
                                        input: "text-white placeholder:text-zinc-600 !outline-none focus:!outline-none focus-visible:!outline-none focus:ring-0 focus-visible:ring-0 bg-transparent"
                                    }}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    isInvalid={!!errors.password}
                                />
                                {errors.password && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-md px-2 py-1.5">
                                        <p className="text-xs text-red-400 font-bold">{errors.password}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Confirmar Senha</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: "bg-zinc-950 border-zinc-700 hover:border-zinc-600 group-data-[focus=true]:border-blue-400 group-data-[focus=true]:ring-0 group-data-[focus=true]:ring-offset-0 after:hidden",
                                        input: "text-white placeholder:text-zinc-600 !outline-none focus:!outline-none focus-visible:!outline-none focus:ring-0 focus-visible:ring-0 bg-transparent"
                                    }}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                className="font-bold mt-2 w-full"
                                isLoading={processing}
                            >
                                CADASTRAR
                            </Button>

                            <div className="flex justify-center mt-2 pt-4 border-t border-zinc-800">
                                <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">
                                    Já tem conta? <span className="text-blue-400 font-bold">Faça Login</span>
                                </Link>
                            </div>

                        </form>
                    </CardBody>
                </Card>

            </div>
        </>
    );
}
