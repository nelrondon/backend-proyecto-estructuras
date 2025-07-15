import { z } from "zod";

const statues = ["Venta", "Alquiler", "Ambas"];
const types = ["Casa", "Apartamento", "Terreno", "Comercial"];

const propertySchema = z.object({
  title: z.string({
    invalid_type_error: "El título debe ser un texto",
    required_error: "El título es requerido",
  }),
  description: z.string({
    invalid_type_error: "La descripción debe ser un texto",
  }),
  status: z.enum(statues, {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_type) {
        return {
          message: "El estado de la propiedad debe ser una cadena de texto.",
        };
      }
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return {
          message: `El estado de propiedad '${
            ctx.data
          }' no es válido. Los estados permitidos son: ${statues.join(", ")}.`,
        };
      }
      return { message: ctx.defaultError };
    },
  }),
  property_type: z.enum(types, {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_type) {
        return { message: "El tipo de propiedad debe ser una cadena de texto" };
      }
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return {
          message: `El tipo de propiedad '${
            ctx.data
          }' no es válido. Los tipos permitidos son: ${types.join(", ")}.`,
        };
      }
    },
  }),
  address: z.string({
    invalid_type_error: "La dirección debe ser un texto",
    required_error: "La dirección es requerida",
  }),
  city: z.string({
    invalid_type_error: "La ciudad debe ser un texto",
    required_error: "La ciudad es requerida",
  }),
  state: z.string({
    invalid_type_error: "El estado debe ser un texto",
    required_error: "El estado es requerida",
  }),
  zip_code: z
    .number({
      invalid_type_error: "El codigo postal debe ser un número",
    })
    .min(4, "El codigo postal consta de +3 números"),
  price: z.number({
    invalid_type_error: "El precio debe ser un número",
    required_error: "El precio es requerido",
  }),
  bedrooms: z.number({
    invalid_type_error: "La cantidad de cuartos debe ser un número",
  }),
  bathrooms: z.number({
    invalid_type_error: "La cantidad de baños debe ser un número",
  }),
  square_feet: z.number({
    invalid_type_error: "Los pies cuadrados deben ser un número",
  }),
});

export function validateProperty(input) {
  return propertySchema.safeParse(input);
}

export function validatePartialProperty(input) {
  return propertySchema.partial().safeParse(input);
}
