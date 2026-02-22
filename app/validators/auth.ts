import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
    'required': 'O campo {{ field }} é obrigatório.',
    'string': 'O valor de {{ field }} deve ser um texto.',
    'email': 'O valor não é um endereço de e-mail válido.',
    'minLength': 'O {{ field }} deve ter pelo menos {{ min }} caracteres.',
    'maxLength': 'O {{ field }} deve ter no máximo {{ max }} caracteres.',
    'confirmed': 'A confirmação de {{ field }} não coincide.',
    'username.unique': 'O nome de usuário já está sendo usado.',
    'email.unique': 'O e-mail já está sendo usado.',
})

/**
 * Validates the user registration payload
 */
export const registerValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(3).maxLength(100),
        email: vine
            .string()
            .trim()
            .email()
            .unique(async (query, field) => {
                const user = await query.from('users').where('email', field).first()
                return !user
            }),
        password: vine.string().minLength(8).maxLength(32).confirmed(),
    })
)

/**
 * Validates the user login payload
 */
export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string(),
    })
)