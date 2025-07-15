import { z } from "zod";

const phoneRegex = new RegExp(
  /^(\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/
);
const containsNumberRegex = new RegExp(/[0-9]/);

const userSchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser texto.",
      required_error: "EL nombre es requerido.",
    })
    .refine(
      (value) => !containsNumberRegex.test(value),
      "El nombre no debe contener números"
    ),
  email: z
    .string({
      required_error: "EL email es requerido.",
    })
    .email("Formato de email invalido"),
  phone: z
    .string({
      required_error: "EL teléfono es requerido.",
    })
    .regex(phoneRegex, "Formato de teléfono inválido"),
  username: z.string({
    invalid_type_error: "El username debe ser texto",
    required_error: "El username es requerido",
  }),
  password: z.string({
    invalid_type_error: "La contraseña debe ser texto",
    required_error: "La contraseña es requerida",
  }),
});

export function validateUser(input) {
  return userSchema.safeParse(input);
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input);
}
