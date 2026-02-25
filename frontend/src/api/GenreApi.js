import { endpointBE } from "../layout/utils/Constant";
import GenreModel from "../model/GenreModel";
import { my_request } from "./Request";

async function getGenre(endpoint) {
   const response = await my_request(endpoint);
   const responeData = response._embedded.genres;
   const genreList = responeData.map((genre) =>
      new GenreModel(genre.idGenre, genre.nameGenre)
   )
   return genreList;
}

export async function getAllGenres() {
   const endpoint = endpointBE + "/genre?sort=idGenre";
   return getGenre(endpoint);
}

export async function get1Genre(idGenre) {
   const endpoint = endpointBE + `/genre/${idGenre}`;
   const response = await my_request(endpoint);
   const genre = new GenreModel(response.idGenre, response.nameGenre);
   return genre;
}

export async function getGenreByIdBook(idBook) {
   const endpoint = endpointBE + `/books/${idBook}/listGenres`;
   return getGenre(endpoint);
}
