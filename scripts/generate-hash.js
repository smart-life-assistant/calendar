const bcrypt = require("bcryptjs");

const password = "S!mpl3P@ssw0rd!2025";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Password:", password);
    console.log("Hash:", hash);
    console.log("\nCopy hash này vào SQL:");
    console.log(
      `UPDATE public.users SET password = '${hash}' WHERE username = 'akira_hikaru';`
    );
  }
});
