import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { recipeData } from "../database/recipedata";
import { Recipe } from "../entities/Recipe";
import { RecipeDataType } from "../types/RecipeDataType";
import { v4 as uuidv4 } from "uuid";

@Resolver()
export class RecipeResolver {
  @Query(() => [Recipe])
  getRecipes(): Array<Recipe> {
    return recipeData;
  }

  @Mutation(() => Recipe)
  createRecipe(@Arg("data") data: RecipeDataType): Recipe {
    let newRecipe = { ...data, id: uuidv4() };
    recipeData.push(newRecipe);
    return newRecipe;
  }

  @Mutation(() => Boolean)
  deleteRecipe(@Arg("id") id: string): boolean {
    let recipeIndex = recipeData.findIndex((recipe) => recipe.id === id);

    if (recipeIndex > -1) {
      recipeData.splice(recipeIndex, 1);
      return true;
    }
    return false;
  }

  @Mutation(() => Recipe)
  updateRecipe(
    @Arg("id") id: string,
    @Arg("data") data: RecipeDataType
  ): Recipe {
    let recipeIndex = recipeData.findIndex((recipe) => recipe.id === id);
    if (recipeIndex > -1) {
      recipeData[recipeIndex] = { ...data, id };
      return recipeData[recipeIndex];
    }
  }
}
