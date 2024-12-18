import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { signInRequestSchema, useSignInMutation } from "../api";

const schema = signInRequestSchema;

export function SignInPage({ path }: { path?: string }) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { mutate, isPending, error } = useSignInMutation();
  const { t } = useTranslation("auth");

  function handleSubmit(values: z.infer<typeof schema>) {
    mutate(values, {
      onSuccess: () => {
        void navigate({
          to: path ?? "/tasks",
        });
      },
    });
  }

  const errorText = useSignInError(error);

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>{t("signIn.title")}</CardTitle>
            <CardDescription>{t("signIn.description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 [&>*]:grid [&>*]:gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("items.username.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("items.password.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
            {error && <p className="text-destructive">{errorText}</p>}
          </CardContent>
          <CardFooter className="grid gap-4">
            <Button type="submit" loading={isPending} className="w-full">
              {t("actions.signIn.label")}
            </Button>
            <span className="text-center">
              {t("actions.signUp.description")}
              <Button variant="link" type="button" asChild>
                <Link to="/sign-up" from="/sign-in" search={(prev) => prev}>
                  {t("actions.signUp.label")}
                </Link>
              </Button>
            </span>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function useSignInError(error: Error | null) {
  const { t } = useTranslation("auth");

  if (!error) {
    return undefined;
  }

  if (error instanceof AxiosError) {
    if (error.response?.status == 401) {
      return t("feedback.wrongUsernameOrPassword.label");
    }
  }

  return t("feedback.genericError.label");
}
