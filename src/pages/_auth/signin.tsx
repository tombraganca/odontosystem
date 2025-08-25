import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const loginSchema = z.object({
  email: z.email("Digite um email válido"),
  password: z
    .string("Campo obrigatório")
    .min(8, "Digite uma senha válida")
    .regex(passwordRegex, "Digite uma senha válida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/_auth/signin")({
  component: SigninPage,
});

export function SigninPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate({ to: "/" });
    } catch (err) {
      toast.error("Credenciais inválidas", {
        description: "Verifique seu email e senha e tente novamente.",
      });
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  className="p-6 md:p-8"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="font-bold text-2xl">
                        Bem vindo de volta!
                      </h1>
                      <p className="text-balance text-muted-foreground">
                        Faça login na sua conta Odonto System
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="email"
                              placeholder="m@example.com"
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Senha</FormLabel>
                            <Link
                              className="ml-auto text-sm underline-offset-2 hover:underline"
                              to="/"
                            >
                              Esqueci minha senha
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="current-password"
                              placeholder="Sua senha"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                      type="submit"
                    >
                      {form.formState.isSubmitting ? "Entrando..." : "Login"}
                    </Button>
                    <div className="text-center text-sm">
                      Não tem uma conta?{" "}
                      <Link className="underline underline-offset-4" to="/">
                        Entre em contato
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
              <div className="relative hidden bg-muted md:block">
                <picture>
                  <img
                    alt="cover"
                    className="absolute inset-0 h-full w-full object-cover"
                    height={500}
                    src="/login-cover.png"
                    width={500}
                  />
                </picture>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-muted-foreground text-xs">
            Ao clicar em continuar, você concorda com nossos Termos de Serviço e
            Política de Privacidade.
          </div>
        </div>
      </div>
    </div>
  );
}
