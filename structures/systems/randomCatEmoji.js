function randomCatEmoji() {
    const emojis = [
        "<:1418magnifyingglasscat:1184975853927534642>",
        "<:1601musclecat:1185252786309435522>",
        "<:1887swordcat:1185252767510573116>",
        "<:3464thumbsupcat:1184976062262804611>",
        "<:4261gamercat:1185252801916444773>",
        "<:5030callmecat:1184982146067214336>",
        "<:5809hardworkercat:1185252638250508318>",
        "<:7683phonecat:1185252920946606160>",
        "<:8418guitarcat:1185252893280972903>",
        "<:9165rockoncat:1185252973752881212>",
        "<:9178cameracat:1185252989242454076>",
        "<:9216beercat:1185253005575061575>",
      ];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
  }



  module.exports = randomCatEmoji;