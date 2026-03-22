import api from "../api/AxiosConfig";
export async function getCategoriesRequest() {
  const { data } = await api.get("/category");
  return data;
}

export const createCategoryRequest = async (category) => {
  const formData = new FormData();

  formData.append(
    "categoryData",
    JSON.stringify({
      categoryName: category.name,
      description: category.description,
    }),
  );

  formData.append("img", category.image);

  return api.post("/category", formData);
};

export async function deleteCategoryRequest(name) {
  await api.delete(`/category/${name}`);
}

export async function updateCategoryRequest(
  name,
  { categoryName, description, image },
) {
  const formData = new FormData();

  formData.append(
    "categoryData",
    JSON.stringify({ categoryName, description }),
  );

  if (image) {
    formData.append("img", image);
  }

  const { data } = await api.put(`/category/${name}`, formData);
  return data;
}
