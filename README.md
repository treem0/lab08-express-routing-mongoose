# LAB: Express Routing & Mongoose Relationships

Update your recipe application so that `Event` is related to a `Recipe`.

## Before you begin

Refer to *Getting Started*  in the [lab submission instructions](../../../reference/submission-instructions/labs/README.md) for complete setup, configuration, deployment, and submission instructions.

## Getting Started

The `starter-code` contains the answer from yesterdays lab.

## Requirements

**Add tests if needed**

### Update Event (2 points)

On the `Event` model update `recipeId` so it is a reference to your `Recipe` model.

### Update Recipe routes(6 points)

#### findById route

On getting a recipe by id also fetch all `Event` documents associated with the recipe

#### findByIdAndDelete route

On deleting a recipe also delete all `Event` documents associated with the recipe

#### find route

Allow users to provide a query string to search for recipes by an ingredient
(e.g. `/api/v1/recipes?ingredient=flour`).

### Update Event routes (2 point)

#### findById route

On getting an event by id `populate` the recipe

## Assignment Submission Instructions
Refer to the the [lab submission instructions](../../../reference/submission-instructions/labs/README.md) for the complete lab submission process and expectations
