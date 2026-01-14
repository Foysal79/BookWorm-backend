import z from "zod";


const createGenreSchema = z.object({
    body : z.object({
        name: z.string().min(2)
    })
})

const updateGenreSchema = z.object({
    body : z.object({
        name: z.string().min(2)
    })
})


export const genreValidation = {
createGenreSchema,
updateGenreSchema
}
