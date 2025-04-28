"use server"

import { revalidatePath } from "next/cache"
import prisma from "../../lib/prisma"
import { Category } from "@prisma/client"

export async function checkAndAddAssociation(email: string, name: string) {

  if(!email) return
  try {
    const existingAssociation =await prisma.association.findUnique({
        where:{
            email
        }
    })

    if(!existingAssociation  && name) {
        await prisma.association.create({
            data:{
                email,name
            }
        })
    }
  } catch (error) {
    console.error(error)
  }

}

export async function getAssociation(email: string) {

  if(!email) return

  try {
    const existingAssociation =await prisma.association.findUnique({
        where:{
            email
        }
    })
  return existingAssociation
   
  } catch (error) {
    console.error(error)
  }

}

export async function createCategory( name:string , email:string, description?: string){
  if(!name) return

  try {
    const association= await getAssociation(email);

    if(!association) {
      throw new Error("Aucune association trouvée avec cet email.");
    }

    await prisma.category.create({
      data:{
        name,
        description:description ||"",
        associationId: association.id
      }
    })
    revalidatePath('/category');

  } catch (error) {
    console.error(error)
  }
}

export async function updateCategory(
  id: string,
  email: string,
  name: string,
  description?: string,
) {
  if(!id || !email || !name) {
    throw new Error("L'id, l'email de l'association et le nom de la catégorie sont requis pour la mise à jour.")
  }

  try {
    const association= await getAssociation(email);

    if(!association) {
      throw new Error("Aucune association trouvée avec cet email.");
    }

    await prisma.category.update({
      where:{
        id:id,
        associationId:association.id
      },
      data:{
        name,
        description:description ||"",
        associationId: association.id
      }
    })
    // revalidatePath('/category');
  } catch (error) {
    console.error(error)
  }
}

export async function deleteCategory(id: string, email: string){
  if (!id || !email) {
    throw new Error("L'id, l'email de l'association et sont requis.")
}

try {
    const association = await getAssociation(email)
    if (!association) {
        throw new Error("Aucune association trouvée avec cet email.");
    }

    await prisma.category.delete({
        where: {
            id: id,
            associationId: association.id
        }
    })

    //  revalidatePath('/category');
} catch (error) {
    console.error(error)
}
}

export async function readCategories(email: string): Promise<Category[] | undefined> {

 if (!email) {
        throw new Error("l'email de l'association est  requis")
    }

    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const categories = await prisma.category.findMany({
            where: {
                associationId: association.id
            }
        })
       
        return categories
    } catch (error) {
        console.error(error)
    }
}

