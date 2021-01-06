let obj = {
  _id: "5fea0554b20baa05a841403a", // generated by Mongoose +

  type: "незаконная свалка", // by input +

  problem: "бытовой мусор", // by input +

  date: "Mon Dec 28 2020 19:48:55 GMT+0300 (Moscow Standard Time)", // current date +

  location: "{ 'latitude': '22.486677', 'longitude': '33.602624' }", // by input +

  image: ["/data/images/2020-12-28_16-48-59_0001_001.jpg"], // by input +

  userComment: "сильно пахнет", // by input +

  video: ["/data/videos/2020-12-28_16-48-59_0001_001.mp4"], // by input

  chatId: "122013352", // by context object
  status: "pending", // by default
  admin: "defaultAdmin", // by default
  adminComment: "Передано в администрацию.",
};

let json = JSON.stringify(obj);

console.log(json);