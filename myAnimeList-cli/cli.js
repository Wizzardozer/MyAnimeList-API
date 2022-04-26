const yargs = require("yargs/yargs");

const app = require("./app.js");

const ranks = [
  "all",
  "airing",
  "upcoming",
  "tv",
  "movie",
  "special",
  "bypopularity",
  "favorite",
];

yargs(process.argv.slice(2))
  .usage("$0: Usage <cmd> [options]")
  .command(
    "search <anime>",
    "searches for the anime",
    (yargs) => {
      return yargs.positional("anime", {
        describe: "name of the anime",
        type: "string",
      });
    },
    // handler
    (args) => {
      app.searchForAnime(args.anime);
    }
  )
  .command(
    "ranking <rank>",
    "searches by rank",
    (yargs) => {
      return yargs.positional("rank", {
        describe: "name of the rank",
        choices: ranks,
        type: "string",
      });
    },
    // handler
    (args) => {
      if (ranks.includes(args.rank)) {
        app.animeByRanking(args.rank);
      } else {
        console.log("not a valid rank");
      }
    }
  )
  .help().argv;
