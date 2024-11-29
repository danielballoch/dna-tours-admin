'use server'

import { z } from 'zod'
// import { redirect } from 'next/navigation'

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.'
    }),
    amount: z.coerce
    .number()
    .gt(0, {message: 'Please enter an amount greater than $0.'}),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.'
    }),
    date: z.string()
})


const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({id: true, date: true})

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
}


export async function handleForm() {
    try {
        console.log("hello api")
    } catch (error){
      console.log(error)
      return {message: 'Database Error: Failed to Delete Invoice'}
    }
  }

