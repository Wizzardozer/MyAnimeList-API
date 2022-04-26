const superagent = require("superagent");
const config = require("./config.json");
// {
//     "url": "https://api.myanimelist.net/v2/anime"
// }

const searchAnime = async (anime) => {
  try {
    const animeURL = `${config.url}?q=${anime}`;
    const response = await superagent
      .get(animeURL)
      .set({ "X-MAL-CLIENT-ID": config.clientid });

    return response.body.data;
  } catch (error) {
    console.log(error.message);
  }
};

const animeDetails = async (animeID) => {
  try {
    const animeURL = `${config.url}/${animeID}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,status,genres,my_list_status,num_episodes,start_season,background,related_anime,related_manga,studios,'`;
    const response = await superagent
      .get(animeURL)
      .set({ "X-MAL-CLIENT-ID": config.clientid });

    return response.body;
  } catch (error) {
    console.log(error.message);
  }
};

const animeRanking = async (ranking) => {
  try {
    const animeURL = `${config.url}/ranking?ranking_type=${ranking}`;

    const response = await superagent
      .get(animeURL)
      .set({ "X-MAL-CLIENT-ID": config.clientid });
    return response.body;
  } catch (error) {
    console.log(error.message);
  }
};

const nextAnimePage = async (page) => {
  try {
    const animeURL = page;
    const response = await superagent
      .get(animeURL)
      .set({ "X-MAL-CLIENT-ID": config.clientid });

    return response.body;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  searchAnime,
  animeDetails,
  animeRanking,
  nextAnimePage,
};
