
import { z } from "zod";
export const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const signUpSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter ao menos 8 caracteres")
    .max(72, "Senha muito longa"),
  displayName: z
    .string()
    .min(1, "Informe seu nome de exibição")
    .max(60, "Máximo 60 caracteres"),
  accountType: z.enum(["user", "shop"], {
    errorMap: () => ({ message: "Escolha o tipo de conta" }),
  }),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(60),
  shopName: z
    .string()
    .max(80)
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : null)),
  bio: z
    .string()
    .max(2000)
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : null)),
});

export const GAMES = ["magic", "pokemon", "onepiece"] as const;
export const CONDITIONS = ["M", "NM", "SP", "MP", "HP", "DMG"] as const;
export const DURATIONS_DAYS = [1, 3, 7, 14, 30] as const;

export const newAuctionSchema = z.object({
  game: z.enum(GAMES),
  cardName: z.string().min(1).max(150),
  imageUrl: z
    .string()
    .url("URL de imagem inválida")
    .regex(/^https?:\/\//, "Apenas http/https"),
  description: z
    .string()
    .max(2000)
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : null)),
  condition: z.enum(CONDITIONS),
  startingPrice: z
    .number({ invalid_type_error: "Informe um número" })
    .positive("Preço deve ser maior que zero")
    .max(999_999_99, "Preço muito alto"),
  durationDays: z
    .number()
    .refine((n) => DURATIONS_DAYS.includes(n as (typeof DURATIONS_DAYS)[number]), {
      message: "Duração inválida",
    }),
});

export const updateAuctionSchema = newAuctionSchema.partial().extend({
  id: z.string().uuid(),
});

export type NewAuctionInput = z.infer<typeof newAuctionSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
