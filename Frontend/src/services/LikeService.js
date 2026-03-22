import api from "../api/AxiosConfig";


export const createUserPlaceRelation = async (username, placeName) => {
  try {
    const { data } = await api.put(`/user/${username}/place/${placeName}`);

    return data;

  } catch (error) {
    console.error("Error creating relation:", error);
    throw error;
  }
};


export const deleteUserPlaceRelation = async (username, placeName) => {
  try {
    const { data } = await api.put(`/deleterelation/user/${username}/place/${placeName}`);

    // data = "Relation successfully deleted"
    return data;

  } catch (error) {
    console.error("Error deleting relation:", error);
    throw error;
  }
};


export const getUserFavoritePlaces = async (userName) => {
  try {
    const { data } = await api.get(`/userplace/ligth/${userName}`);
    return data; // lista de PlaceLigthRecord
  } catch (error) {
    console.error("Error fetching user favorite places:", error);
    throw error;
  }
};
