/* eslint-disable camelcase */
const inquirer = require("inquirer");
const animeApiList = require("myanimelist-api");

const _userPrompt = (animeList) => {
  const searchResult = [];

  animeList.forEach((anime) => {
    searchResult.push(anime.node.title);
  });

  return inquirer.prompt({
    type: "list",
    name: "anime",
    message: "select an anime to view",
    choices: searchResult,
  });
};

const animeRankPrompt = () => {
  return inquirer.prompt({
    type: "list",
    name: "animeRank",
    message: "Go to next page or exit",
    choices: ["next", "exit"],
  });
};

const animeID = (animeList, animeName) => {
  let id = null;
  animeList.forEach((anime) => {
    if (anime.node.title === animeName.anime) {
      id = anime.node.id;
    }
  });
  return id;
};

const _print = (
  animeTitle,
  enTitle,
  start,
  end,
  rating,
  episodes,
  status,
  synopsis,
  studios
) => {
  console.log(
    `-------------------------------------------------------------------------------------------`
  );
  console.log(
    `Title: ${animeTitle}     Eng: ${enTitle}     Rating: ${rating}\tStatus: ${status} \tStudio: ${studios[0].name}\n`
  );

  console.log(`Start: ${start}\n`);
  console.log(`End:  ${end}\n`);
  console.log(`Number of Episode: ${episodes}\n`);
  console.log(
    `-------------------------------------------------------------------------------------------`
  );
  console.log("Synopsis");
  console.log(
    "___________________________________________________________________________________________"
  );

  console.log(synopsis);
  console.log(
    "___________________________________________________________________________________________"
  );
};

const _printAnimeRank = (animeRankings) => {
  const animes = animeRankings.data;
  animes.forEach((anime) => {
    console.log(`${anime.ranking.rank}. ${anime.node.title}\n`);
  });
};

const formatDate = (date, status) => {
  //Formats the date as mm/dd/yyyy
  if (status === "finish_airing" || status === "Currently Airing") {
    date = date.split("-");
    [date[0], date[1], date[2]] = [date[1], date[2], date[0]];
    date = date.join("-");
  }
  //Not yet aired
  else {
    if (date) {
      date = date.split("-");
      [date[0], date[1]] = [date[1], date[0]];
      date = date.join("-");
    } else {
      date = "??";
    }
  }

  return date;
};

const searchForAnime = async (anime) => {
  try {
    const animeList = await animeApiList.searchAnime(anime);
    const animeName = await _userPrompt(animeList);

    const getAnimeID = animeID(animeList, animeName);
    const animeDetails = await animeApiList.animeDetails(getAnimeID);
    const {
      title,
      alternative_titles: { en },
      start_date,
      end_date,
      mean = "N/A",
      num_episodes,
      status,
      synopsis,
      studios,
    } = animeDetails;
    const new_start_date = formatDate(start_date, status);
    const new_end_Date = formatDate(end_date, status);

    _print(
      title,
      en,
      new_start_date,
      new_end_Date,
      mean,
      num_episodes,
      status,
      synopsis,
      studios
    );
  } catch (error) {
    console.log("error");
  }
};

const animeByRanking = async (ranking) => {
  const animeList = await animeApiList.animeRanking(ranking);
  _printAnimeRank(animeList);
  let next = animeList.paging.next;
  let x = true;
  while (x) {
    const animeRank = await animeRankPrompt();
    if (animeRank.animeRank === "next") {
      const nextPage = await animeApiList.nextAnimePage(next);
      _printAnimeRank(nextPage);
      next = nextPage.paging.next;
    } else {
      x = !x;
    }
  }
};

module.exports = {
  searchForAnime,
  animeByRanking,
};
